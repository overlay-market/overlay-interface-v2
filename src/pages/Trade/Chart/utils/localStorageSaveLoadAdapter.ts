import { ChartData, ChartMetaInfo, ChartTemplate, ChartTemplateContent, IExternalSaveLoadAdapter, StudyTemplateData, StudyTemplateMetaInfo } from "../../../../charting_library/charting_library";

interface SavedChartData extends ChartData {
  timestamp: number;
  id: string;
}

interface DrawingTemplate {
  name: string;
  toolName: string;
  content: string;
}

interface SavedChartTemplate extends ChartTemplate {
  name: string;
}

interface LineToolState {
    id: string; 
    ownerSource: string; 
    state: unknown; 
    currencyId?: string; 
    groupId?: string; 
    symbol?: string; 
    unitId?: string; 
}

const storageKeys = {
  charts: 'LocalStorageSaveLoadAdapter_charts',
  studyTemplates: 'LocalStorageSaveLoadAdapter_studyTemplates',
  drawingTemplates: 'LocalStorageSaveLoadAdapter_drawingTemplates',
  chartTemplates: 'LocalStorageSaveLoadAdapter_chartTemplates',
  drawings: 'LocalStorageSaveLoadAdapter_drawings',
} as const;

type LayoutDrawings = Record<string, LineToolState>;
type SavedDrawings = Record<string, LayoutDrawings>;

export class LocalStorageSaveLoadAdapter implements IExternalSaveLoadAdapter {
  private _charts: SavedChartData[] = [];
  private _studyTemplates: StudyTemplateData[] = [];
  private _drawingTemplates: DrawingTemplate[] = [];
  private _chartTemplates: SavedChartTemplate[] = [];
  private _isDirty = false;
  protected _drawings: SavedDrawings = {};
  private readonly MAX_CHARTS = 100;
  private marketName: string | undefined;

  public constructor(marketName?: string) {
    this.marketName = marketName;

      this._charts =
          this._getFromLocalStorage<SavedChartData[]>(storageKeys.charts) ?? [];
      this._studyTemplates =
          this._getFromLocalStorage<StudyTemplateData[]>(storageKeys.studyTemplates) ?? [];
      this._drawingTemplates =
          this._getFromLocalStorage<DrawingTemplate[]>(storageKeys.drawingTemplates) ?? [];
      this._chartTemplates =
          this._getFromLocalStorage<SavedChartTemplate[]>(storageKeys.chartTemplates) ?? [];
      this._drawings =
          this._getFromLocalStorage<SavedDrawings>(storageKeys.drawings) ?? {};

      this._enforceChartLimit();    

      setInterval(() => {
          if (this._isDirty) {
              this._saveAllToLocalStorage();
              this._isDirty = false;
          }
      }, 1000);
  }

  public getAllCharts(): Promise<ChartMetaInfo[]> {
    return Promise.resolve(this._charts.filter(chart => chart.symbol === this.marketName).map(chart => ({
        ...chart,
        id: Number(chart.id), 
    })));
  }

  public removeChart(id: string | number): Promise<void> {
      this._charts = this._charts.filter(chart => chart.id !== String(id));
      this._isDirty = true;
      return Promise.resolve();
  }

  public saveChart(chartData: ChartData): Promise<string> {
      if (!chartData.id) {
          chartData.id = this._generateUniqueChartId();
      } else {
          this.removeChart(chartData.id);
      }
      const savedChartData: SavedChartData = {
          ...chartData,
          id: String(chartData.id),
          timestamp: Math.round(Date.now() / 1000),
      };
      this._charts.push(savedChartData);
      this._enforceChartLimit();
      this._isDirty = true;
      
      return Promise.resolve(savedChartData.id);
  }

  public getChartContent(id: string | number): Promise<string> {
      const chart = this._charts.find(chart => chart.id === String(id));
      
      return chart ? Promise.resolve(chart.content) : Promise.reject(new Error('The chart does not exist'));
  }

  public async getAllChartTemplates(): Promise<string[]> {
      return this._chartTemplates.map(x => x.name);
  }

  public async saveChartTemplate(
      templateName: string,
      content: ChartTemplateContent
  ): Promise<void> {
      const existingTemplate = this._chartTemplates.find(x => x.name === templateName);
      if (existingTemplate) {
          existingTemplate.content = content;
      } else {
          this._chartTemplates.push({ name: templateName, content });
      }
      this._isDirty = true;
  }

  public async removeChartTemplate(templateName: string): Promise<void> {
      this._chartTemplates = this._chartTemplates.filter(x => x.name !== templateName);
      this._isDirty = true;
  }

  public async getChartTemplateContent(templateName: string): Promise<ChartTemplate> {
      const content = this._chartTemplates.find(x => x.name === templateName)?.content;
      return { content: structuredClone(content) };
  }

  public getAllStudyTemplates(): Promise<StudyTemplateData[]> {
    return Promise.resolve(this._studyTemplates);
}

    public removeStudyTemplate(studyTemplateData: StudyTemplateMetaInfo): Promise<void> {
        this._studyTemplates = this._studyTemplates.filter(
            template => template.name !== studyTemplateData.name
        );
        this._isDirty = true;
        return Promise.resolve();
    }

    public saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void> {
        this._studyTemplates = this._studyTemplates.filter(
            template => template.name !== studyTemplateData.name
        );
        this._studyTemplates.push(studyTemplateData);
        this._isDirty = true;
        return Promise.resolve();
    }

    public getStudyTemplateContent(studyTemplateData: StudyTemplateMetaInfo): Promise<string> {
        const template = this._studyTemplates.find(t => t.name === studyTemplateData.name);
        return template ? Promise.resolve(template.content) : Promise.reject(new Error('Template not found'));
    }

    public getDrawingTemplates(): Promise<string[]> {
        return Promise.resolve(Array.from(this._drawingTemplates.keys()).map(String));
    }

    public loadDrawingTemplate(templateName: string): Promise<string> {
        const template = this._drawingTemplates.find(t => t.name === templateName);
        return template ? Promise.resolve(template.content) : Promise.reject(new Error('Template not found'));
    }

    public saveDrawingTemplate(templateName: string, content: string): Promise<void> {
        const existingTemplate = this._drawingTemplates.find(t => t.name === templateName);
        
        if (existingTemplate) {
            existingTemplate.content = content;
        } else {
            this._drawingTemplates.push({ name: templateName, content, toolName: "defaultTool" });
        }
    
        return Promise.resolve();
    }
    
    public removeDrawingTemplate(templateName: string): Promise<void> {
        const index = this._drawingTemplates.findIndex(t => t.name === templateName);
        
        if (index !== -1) {
            this._drawingTemplates.splice(index, 1);
        }
    
        return Promise.resolve();
    }

  protected _getFromLocalStorage<T>(key: string): T {
      const dataFromStorage = window.localStorage.getItem(key);
      return JSON.parse(dataFromStorage || 'null');
  }

  protected _saveToLocalStorage(key: string, data: any): void {
      window.localStorage.setItem(key, JSON.stringify(data));
  }

  protected _saveAllToLocalStorage(): void {
      this._saveToLocalStorage(storageKeys.charts, this._charts);
      this._saveToLocalStorage(storageKeys.studyTemplates, this._studyTemplates);
      this._saveToLocalStorage(storageKeys.drawingTemplates, this._drawingTemplates);
      this._saveToLocalStorage(storageKeys.chartTemplates, this._chartTemplates);
      this._saveToLocalStorage(storageKeys.drawings, this._drawings);
  }

  private _enforceChartLimit(): void {
    if (this._charts.length > this.MAX_CHARTS) {
      this._charts.sort((a, b) => a.timestamp - b.timestamp);
      this._charts = this._charts.slice(-this.MAX_CHARTS);
    }
  }

  private _generateUniqueChartId(): string {
      const existingIds = this._charts.map(i => i.id);
   
      while (true) {
        let uid = Math.random().toString().slice(6);
        uid = Number(uid).toString();

        if (!existingIds.includes(uid)) {
            return uid;
        }
    }
  }
}