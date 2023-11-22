import { Component, OnInit, Injector, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Statement, StatementPage } from '../statement';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { Constants } from 'src/app/shared/constants/constants';
import { MessageDialogService } from 'src/app/shared/services/mesage-dialog.service';
import { FormGroup, FormBuilder, Validators, FormControl, SelectControlValueAccessor, FormArray, ValidatorFn } from '@angular/forms';
import { StatementService } from '../statement.service';
import { TemplateService } from 'src/app/layout/template/template.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorMessageConstants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public isCollapsedDetails: boolean = false;
  public isCollapsedPermissions: boolean = true;
  public statementFormGroup: FormGroup;
  public pageTypeList = [];

  public statement;
  public updateOperationMode: boolean;
  public params: any = [];
  public pages: any = [];
  public allPages: any = [];
  public selectedPages: any[];
  public isStatementDetailsLoaded = false;
  constructor(
    private _location: Location,
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _http: HttpClient,
    private _spinnerService: NgxUiLoaderService,
    private formbuilder: FormBuilder,
    private _messageDialogService: MessageDialogService,
    private statementService: StatementService,

    private injector: Injector,
  ) {
    this.statement = new Statement;
    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/statementdefination/Add')) {
          this.updateOperationMode = false;
          this.statement.CreatedDate = new Date();
          this.statement.StatementOwnerName = localStorage.getItem('currentUserName');
          localStorage.removeItem("statementparams");
        }
      }
    });

    if (localStorage.getItem("statementparams")) {
      this.updateOperationMode = true;
    } else {
      this.updateOperationMode = false;
      this.statement.CreatedDate = new Date();
      this.statement.StatementOwnerName = localStorage.getItem('currentUserName');
    }

    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/statementdefination')) {
          //set passing parameters to localstorage.
          this.params = JSON.parse(localStorage.getItem('statementparams'));
          if (localStorage.getItem('statementparams')) {
            this.statement.Identifier = this.params.Routeparams.passingparams.StatementIdentifier;
            //this.getStatements();
          }
        } else {
          localStorage.removeItem("statementparams");
        }
      }
    });
  }

  public DataFormat;
  ngOnInit() {
    this.DataFormat = localStorage.getItem('DateFormat');
    this.statementFormGroup = this.formbuilder.group({
      statementName: ['', Validators.compose([Validators.required, Validators.minLength(2),
      Validators.maxLength(100)])],
      statementDescription: ['', Validators.compose([Validators.maxLength(500)])],
      pageType: [0]

    });
    this.selectedPages = [];
    this.getTemplates(null);
  }

  navigateToListPage() {
    this._router.navigate(['/statementdefination']);
  }

  async getStatements() {
    let statementService = this.injector.get(StatementService);
    var searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'Id';
    searchParameter.SortParameter.SortOrder = Constants.Descending;
    searchParameter.SearchMode = Constants.Exact;
    searchParameter.Identifier = this.statement.Identifier;
    searchParameter.IsStatementPagesRequired = true;
    var response = await statementService.getStatements(searchParameter);
    var statementList = response.List;
    this.isStatementDetailsLoaded = true;
    if (statementList.length == 0) {
      this._messageDialogService.openDialogBox('Error', "Statement Not Found", Constants.msgBoxError);
    }
    this.statement = statementList[0];
    this.statementFormGroup.controls['statementName'].setValue(statementList[0].Name);
    this.statementFormGroup.controls['statementDescription'].setValue(statementList[0].Description);
    for (var i = 0; i < this.statement.StatementPages.length; i++) {
      var element = this.pages.find(item => {
        if (item.Identifier == this.statement.StatementPages[i].ReferencePageId) {
          return item;
        }
      });
      if (element != undefined && element != null) {
        this.selectedPages.push(element);
        this.pages = Array.prototype.filter.call(this.pages, (file: any) => file.Identifier != element.Identifier);
      }
    }
  }

  get statementName() {
    return this.statementFormGroup.get('statementName');
  }

  get statementDescription() {
    return this.statementFormGroup.get('statementDescription');
  }

  async getTemplates(parameter) {
    var searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'PublishedOn';
    searchParameter.SortParameter.SortOrder = Constants.Descending
    searchParameter.Status = "Published";
    let templateService = this.injector.get(TemplateService);
    if (parameter !=null) {
      searchParameter.PageTypeId = parameter.PageTypeId;
    }
    var response = await templateService.getTemplates(searchParameter);
    this.pages = response.templateList;
    if (localStorage.getItem('statementparams') && this.isStatementDetailsLoaded == false) {
      this.getStatements();
    }
    if (this.selectedPages.length > 0) {
      for (var i = 0; i < this.selectedPages.length; i++) {
        this.pages = Array.prototype.filter.call(this.pages, (file: any) => file.Identifier != this.selectedPages[i].Identifier);
      }
    }
    this.getPageTypes();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  public onPageTypeSelected(event) {
    if (this.statementFormGroup.value.pageType == null ) {
      this.getTemplates(null);
    }
    else {
      var parameter: any = {};
      parameter.PageTypeId = this.statementFormGroup.value.pageType;
      this.getTemplates(parameter);
    }
  }

  bindPages(): void {
    this.isCollapsedPermissions = !this.isCollapsedPermissions;
  }

  async saveStatement() {
    this.statement.Name = this.statementFormGroup.value.statementName;
    this.statement.Description = this.statementFormGroup.value.statementDescription;
    this.statement.StatementPages = [];
    for (var i = 0; i < this.selectedPages.length; i++) {
      var stmtPage: any = {};
      stmtPage.ReferencePageId = this.selectedPages[i].Identifier,
        stmtPage.StatementId = this.statement.Identifier,
        stmtPage.SequenceNumber = i,
        stmtPage.PageName = this.selectedPages[i].DisplayName
      this.statement.StatementPages.push(stmtPage);
    }
    var userid = localStorage.getItem('UserId');
    this.statement.UpdateBy = userid;
    if (this.updateOperationMode == false) {
      this.statement.Owner = userid;
    }

    let pageArray = [];
    pageArray.push(this.statement);
    let statementService = this.injector.get(StatementService);
    let isRecordSaved = await statementService.saveStatement(pageArray, this.updateOperationMode);
    if (isRecordSaved) {
      let message = Constants.recordAddedMessage;
      if (this.updateOperationMode) {
        message = Constants.recordUpdatedMessage;
      }
      this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
      this.navigateToListPage()
    }
  }

  async getPageTypes() {
    let templateService = this.injector.get(TemplateService);
    this.pageTypeList = [{ "Identifier": 0, "PageTypeName": "Select Page Type"}];
    let list = await templateService.getPageTypes();
      if (this.pageTypeList.length == 0) {
          let message = ErrorMessageConstants.getNoRecordFoundMessage;
          this._messageDialogService.openDialogBox('Error', message, Constants.msgBoxError).subscribe(data => {
              if (data == true) {
                  this.getPageTypes();
              }
          });
      } else {
        this.pageTypeList = [...this.pageTypeList, ...list];
      }
  }
}
