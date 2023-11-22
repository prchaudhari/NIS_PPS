import { Injectable } from '@angular/core';
import { DialogService } from '@tomblue/ng2-bootstrap-modal';
import { PagePreviewComponent } from '../pagepreview/pagepreview.component'
import { WidgetPreviewComponent } from '../widgetpreview/widgetpreview.component'
import { Observable } from 'rxjs';
import { MultipleMessageboxComponent } from '../modules/multiple-messagebox/multiple-messagebox.component';
import { ErrorLogsViewComponent } from '../error-logs-view/error-logs-view.component'
import { PageDesignPreviewComponent } from '../../dashboard-designer/page-design-preview/page-design-preview.component';

@Injectable({
  providedIn: 'root'
})
export class PreviewDialogService {

  constructor(private _dialogService: DialogService) { }

  openPreviewDialogBox(message): Observable<any> {
    return this._dialogService.addDialog(PagePreviewComponent, {
      htmlContent: message,
    });
  }

  openWidgetPreviewDialogBox(message, chartData): Observable<any> {
    console.log(chartData);
    return this._dialogService.addDialog(WidgetPreviewComponent, {
      htmlContent: message,
      ChartData: chartData
    });
  }

  openPageDesignPreviewDialogBox(array, AssetId, Url, pageTypeId): Observable<any> {
    return this._dialogService.addDialog(PageDesignPreviewComponent, {
      widgetItemArray: array,
      BackgroundImageAssetId: AssetId,
      BackgroundImageURL: Url,
      PageTypeId: pageTypeId
    });
  }

  openErrorLogDialogBox(scheduleLogId, scheduleName): Observable<any> {
    return this._dialogService.addDialog(ErrorLogsViewComponent, {
      scheduleLogId: scheduleLogId,
      scheduleName: scheduleName,
    });
  }

  openMulipleMessageDialogBox(title, message, msgType): Observable<any> {
    return this._dialogService.addDialog(MultipleMessageboxComponent, {
      title: title,
      message: message,
      msgType: msgType,
      actionButtonText: "Ok",
      showCancelButtun: false,
      cancelButtonText: "Cancel"
    });
  }

}
