`use strict`

const express = require("express");
const router = express.Router();

const allAttributes = {
    hunger: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    hunger_per_second: {
        default: () => 0.01
    },
    thirst: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    thirst_per_second: {
        default: () => 0.015
    },
    boredom: {
        default: () => new Date().getTime(),
        max: () => new Date().getTime()
    },
    boredom_per_second: {
        default: () => 0.012
    },
    all_hats: {
        default: () => ["fedora", "fez", "tophat"]
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
    const minimum = new Date().getTime() - 1000/(await getAttribute(`${name}_per_second`));
    const value = Math.min(Math.max(await getAttribute(name), minimum) + delta, allAttributes[name].max());
    await setAttribute(name, value);
}

router.get("/feed", async (req, res) => {
    const { amount } = req.query;
    const rawIncrement = amount / (await getAttribute("hunger_per_second")) * 1000;
    await increaseAttribute("hunger", rawIncrement);
    res.json({});
});

router.get("/water", async (req, res) => {
    const { amount } = req.query;
    const rawIncrement = amount / (await getAttribute("thirst_per_second")) * 1000;
    await increaseAttribute("thirst", rawIncrement);
    res.json({});
});

router.get("/play", async (req, res) => {
    const { amount } = req.query;
    const rawIncrement = amount / (await getAttribute("boredom_per_second")) * 1000;
    await increaseAttribute("boredom", rawIncrement);
    res.json({});
});

router.get("/set_hat", async (req, res) => {
    const { hat } = req.query;
    if (hat) {
        await setAttribute("hat", null);
    } else {
        const all_hats = await getAttribute("all_hats");
        const hat = all_hats.includes(value) ? value : allAttributes.hat.default();
        await setAttribute("hat", hat);
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

module.exports = { router, emitAttributes };
