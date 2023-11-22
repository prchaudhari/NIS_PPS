import { AppSettings } from '../../appsettings';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageDialogService } from 'src/app/shared/services/mesage-dialog.service';
import { URLConfiguration } from 'src/app/shared/urlConfiguration/urlconfiguration';
import { HttpClientService } from 'src/app/core/services/httpClient.service';
import { Constants } from 'src/app/shared/constants/constants';
import { Template } from 'src/app/layout/template/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  public templateList: Template[] = [];
  public isRecordFound: boolean = false;
  public isRecordSaved: boolean = false;
  public isRecordDeleted = {};
  public resultFlag = {};

  constructor(private http: HttpClient,
    private injector: Injector,
    private uiLoader: NgxUiLoaderService,
    private _messageDialogService: MessageDialogService) { }

    //method to call api of get pages.
    async getTemplates(searchParameter): Promise<any> {
        let httpClientService = this.injector.get(HttpClientService);
        let requestUrl = URLConfiguration.pageGetUrl;
        this.uiLoader.start();
        var response : any = {};
        await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    if (httpEvent["status"] === 200) {
                        this.templateList = [];
                        this.uiLoader.stop();
                        httpEvent['body'].forEach(pageObject => {
                            this.templateList = [...this.templateList, pageObject];
                        });
                        response.templateList = this.templateList;
                        response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
                    }
                    else {
                        this.templateList = [];
                        response.templateList = this.templateList;
                        response.RecordCount = 0;
                        this.uiLoader.stop();
                    }
                }
            }, (error: HttpResponse<any>) => {
                this.templateList = [];
                this.uiLoader.stop();
                if (error["error"] != null) {
                    let errorMessage = error["error"].Error["Message"];
                    this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
                }
            });
        return response
  }

  async getTemplatesForlist(searchParameter): Promise<any> {
    let httpClientService = this.injector.get(HttpClientService);
    let requestUrl = URLConfiguration.pageGetPagesForListUrl;
    this.uiLoader.start();
    var response: any = {};
    await httpClientService.CallHttp("POST", requestUrl, searchParameter).toPromise()
      .then((httpEvent: HttpEvent<any>) => {
        if (httpEvent.type == HttpEventType.Response) {
          if (httpEvent["status"] === 200) {
            this.templateList = [];
            this.uiLoader.stop();
            httpEvent['body'].forEach(pageObject => {
              this.templateList = [...this.templateList, pageObject];
            });
            response.templateList = this.templateList;
            response.RecordCount = parseInt(httpEvent.headers.get('recordCount'));
          }
          else {
            this.templateList = [];
            response.templateList = this.templateList;
            response.RecordCount = 0;
            this.uiLoader.stop();
          }
        }
      }, (error: HttpResponse<any>) => {
        this.templateList = [];
        this.uiLoader.stop();
        if (error["error"] != null) {
          let errorMessage = error["error"].Error["Message"];
          this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
        }
      });
    return response
  }

    //service method to save or update template records
    public async saveTemplate(postData, pageEditModeOn): Promise<boolean> {
        let httpClientService = this.injector.get(HttpClientService);
        let requestUrl = URLConfiguration.pageAddUrl;
        if (pageEditModeOn) {
            requestUrl = URLConfiguration.pageUpdateUrl;
        }
        this.uiLoader.start();
        await httpClientService.CallHttp("POST", requestUrl, postData).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    this.uiLoader.stop();
                    if (httpEvent["status"] === 200) {
                        this.isRecordSaved = true;
                    }
                    else {
                        this.isRecordSaved = false;
                    }
                }
            }, (error) => {
                this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
                this.isRecordSaved = false;
                this.uiLoader.stop();
            });
        return <boolean>this.isRecordSaved;
    }

    //method to call api of delete page.
    public async deletePage(postData): Promise<boolean> {
        let httpClientService = this.injector.get(HttpClientService);
        let identifier = null;
        if (postData.length > 0) {
            identifier = postData[0].Identifier;
        }
        let requestUrl = URLConfiguration.pageDeleteUrl + '?pageIdentifier=' + identifier;
        this.uiLoader.start();
        await httpClientService.CallHttp("POST", requestUrl).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    this.uiLoader.stop();
                    if (httpEvent["status"] === 200) {
                        this.isRecordDeleted = true
                    }
                    else {
                        this.isRecordDeleted = false
                    }
                }
            }, (error) => {
                this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
                this.uiLoader.stop();
                this.isRecordDeleted = false
            });
        return <boolean>this.isRecordDeleted;
    }

    //method to call api of publish page.
    public async publishPage(postData): Promise<boolean> {
        let httpClientService = this.injector.get(HttpClientService);
        let identifier = null;
        if (postData.length > 0) {
            identifier = postData[0].Identifier;
        }
        let requestUrl = URLConfiguration.pagePublishUrl + '?pageIdentifier=' + identifier;
        this.uiLoader.start();
        await httpClientService.CallHttp("POST", requestUrl).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    this.uiLoader.stop();
                    if (httpEvent["status"] === 200) {
                        this.resultFlag = true
                    }
                    else {
                        this.resultFlag = false
                    }
                }
            }, (error) => {
                this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
                this.uiLoader.stop();
                this.resultFlag = false
            });
        return <boolean>this.resultFlag;
    }

    //method to call api of clone page.
    public async clonePage(postData): Promise<boolean> {
        let httpClientService = this.injector.get(HttpClientService);
        let identifier = null;
        if (postData.length > 0) {
            identifier = postData[0].Identifier;
        }
        let requestUrl = URLConfiguration.pageCloneUrl + '?pageIdentifier=' + identifier;
        this.uiLoader.start();
        await httpClientService.CallHttp("POST", requestUrl).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    this.uiLoader.stop();
                    if (httpEvent["status"] === 200) {
                        this.resultFlag = true
                    }
                    else {
                        this.resultFlag = false
                    }
                }
            }, (error) => {
                this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
                this.uiLoader.stop();
                this.resultFlag = false
            });
        return <boolean>this.resultFlag;
    }

    //method to call api of preview page.
    public async previewPage(postData): Promise<string> {
        let httpClientService = this.injector.get(HttpClientService);
        let identifier = null;
        if (postData.length > 0) {
            identifier = postData[0].Identifier;
        }
        
        let requestUrl = URLConfiguration.pagePreviewUrl + '?pageIdentifier=' + identifier;
        this.uiLoader.start();
        let resultString:string="";

        await httpClientService.CallHttp("POST", requestUrl).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    this.uiLoader.stop();
                    if (httpEvent["status"] === 200) {
                        resultString = httpEvent['body'];
                    }
                    else {
                        resultString = '';
                    }
                }
            }, (error) => {
                this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
                this.uiLoader.stop();
                resultString='';
            });
        return <string>resultString;
    }

    //method to call api of get pages.
    async getPageTypes(): Promise<any[]> {
        let httpClientService = this.injector.get(HttpClientService);
        let requestUrl = URLConfiguration.pageTypeGetUrl;
        let pageTypes: any[] = [];
        this.uiLoader.start();
        await httpClientService.CallHttp("POST", requestUrl).toPromise()
            .then((httpEvent: HttpEvent<any>) => {
                if (httpEvent.type == HttpEventType.Response) {
                    if (httpEvent["status"] === 200) {
                        pageTypes = [];
                        this.uiLoader.stop();
                        httpEvent['body'].forEach(pageType => {
                            pageTypes = [...pageTypes, pageType];
                        });
                    }
                    else {
                        pageTypes = [];
                        this.uiLoader.stop();
                    }
                }
            }, (error: HttpResponse<any>) => {
                pageTypes = [];
                this.uiLoader.stop();
                if (error["error"] != null) {
                    let errorMessage = error["error"].Error["Message"];
                    this._messageDialogService.openDialogBox('Error', errorMessage, Constants.msgBoxError);
                }
            });
        return <any[]>pageTypes
    }
}
