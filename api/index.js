`use strict`

const express = require("express");
const router = express.Router();

const allAttributes = {
    hunger: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    hunger_per_second: {
        default: () => 1 / 3600 / 24
    },
    thirst: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    thirst_per_second: {
        default: () => 1 / 3600 / 24 * 1.2
    },
    boredom: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    boredom_per_second: {
        default: () => 1 / 3600 / 24 * 0.9
    },
    all_hats: {
        default: () => ["fedora", "cowboy", "baseball", "party"]
    },
    hat: {
        default: () => null
    }
};

const { io, db } = require("../common");

const getAttribute = async (name) => {
    return new Promise((resolve, reject) => {
        db.db.collection("attributes").findOne({ name }, (err, doc) => {
            if (err) {
                reject(err);
            } else if (doc?.value) {
                resolve(doc.value);
            } else {
                const value = allAttributes[name].default();
                setAttribute(name, value).then(() => { resolve(value) });
            }
        })
    })
};

const setAttribute = async (name, value) => {
    await db.db.collection("attributes").findOneAndUpdate({ name }, { $set: { value } }, { upsert: true });
    emitAttributes([name], null);
}

const increaseAttribute = async (name, delta) => {
    const rate = await getAttribute(`${name}_per_second`);
    const now = new Date().getTime();
    const currentTimestamp = await getAttribute(name);
    const currentValue = (now - currentTimestamp) / 1000 * rate;
    const newValue = Math.min(Math.max(currentValue + delta, 0), 1);
    const newTimestamp = now - (newValue / rate * 1000);
    await setAttribute(name, newTimestamp);
}

router.get("/feed", async (req, res) => {
    const { amount } = req.query;
    await increaseAttribute("hunger", -amount);
    res.json({});
});

router.get("/water", async (req, res) => {
    const { amount } = req.query;
    await increaseAttribute("thirst", -amount);
    res.json({});
});

router.get("/play", async (req, res) => {
    const { amount } = req.query;
    await increaseAttribute("boredom", -amount);
    res.json({});
});

router.get("/set_hat", async (req, res) => {
    const { hat } = req.query;
    if (!hat) {
        await setAttribute("hat", null);
    } else {
        const all_hats = await getAttribute("all_hats");
        const value = all_hats.includes(hat) ? hat : allAttributes.hat.default();
        await setAttribute("hat", value);
    }
});

router.get("/headpat", (req, res) => {
    io.emit("headpat");
})

const emitAttributes = async (attributes, socket) => {
    const subject = attributes ?? Object.keys(allAttributes);
    const recipient = socket ?? io;
    for (const attribute of subject) {
        recipient.emit(`attribute/${attribute}`, await getAttribute(attribute));
    }
}

const setupListeners = (socket) => {
    socket.on("createGhost", (...args) => {
        socket.broadcast.emit("createGhost", ...args);
    });

    socket.on("updateGhost", (...args) => {
        socket.broadcast.emit("updateGhost", ...args);
    });

    socket.on("deleteGhost", (...args) => {
        socket.broadcast.emit("deleteGhost", ...args);
    });

    socket.on("createEntity", (...args) => {
        socket.broadcast.emit("createEntity", ...args);
    });

    socket.on("updateEntity", (...args) => {
        socket.broadcast.emit("updateEntity", ...args);
    });

    socket.on("deleteEntity", (...args) => {
        socket.broadcast.emit("deleteEntity", ...args);
    });

    socket.broadcast.emit("sendEntitiesPls");

    socket.on("hereAreEntities", (entities) => {
        for (const entity of entities) {
            socket.broadcast.emit("createEntity", ...entity);
        }
    });

    socket.on("headpat", () => {
        socket.broadcast.emit("headpat");
    })

}

module.exports = { router, emitAttributes, setupListeners };
