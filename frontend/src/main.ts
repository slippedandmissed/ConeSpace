import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


document.addEventListener("touchmove", (e) => { e.preventDefault() }, { passive: false });
const enableAudio = () => {
  const audio: HTMLAudioElement | null = document.querySelector("audio");
  if (audio) {
    audio.muted = false;
  }
};
window.addEventListener("touchstart", enableAudio);
window.addEventListener("mousedown", enableAudio);