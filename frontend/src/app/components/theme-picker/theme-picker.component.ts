import { Component, OnInit } from '@angular/core';
import { ThemeMetadata, ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'ukis-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {

  public themes: ThemeMetadata[];
  public currentTheme: ThemeMetadata;

  constructor(
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.getThemes();
    this.currentTheme = this.themeService.getActiveTheme();
  }

  ngOnInit(): void {
  }

  selectTheme(themeName: string) {
    this.themeService.selectTheme(themeName);
  }

}
