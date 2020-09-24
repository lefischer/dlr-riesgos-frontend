import { Injectable } from '@angular/core';
import { StyleManager } from './style.manager';

export interface ThemeMetadata {
  name: string;
  displayName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: ThemeMetadata[] = [{
      displayName: 'Light',
      name: 'clr-ui',
    }, {
      displayName: 'Dark',
      name: 'clr-ui-dark',
    }];

    private activeTheme: ThemeMetadata = this.themes[1];

  constructor(private styleMngr: StyleManager) {
    this.selectTheme(this.activeTheme.name);
  }

  public getThemes() {
    return this.themes;
  }

  public getActiveTheme() {
    return this.activeTheme;
  }

  public selectTheme(themeName: string) {
    const theme = this.themes.find(t => t.name === themeName);
    this.styleMngr.setStyle('theme', `assets/${theme.name}.css`);
    this.activeTheme = theme;
  }
}
