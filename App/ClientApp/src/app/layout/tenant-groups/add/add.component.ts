import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { Constants } from 'src/app/shared/constants/constants';
import { MessageDialogService } from 'src/app/shared/services/mesage-dialog.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CountryService } from '../../country/country.service';
import { Tenant } from '../../tenants/tenant';
import { TenantService } from '../../tenants/tenant.service';
import { UserService } from '../../users/user.service';
import { RoleService } from '../../roles/role.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public isCollapsedDetails: boolean = false;
  public isCollapsedTenantGroupUsers: boolean = true;
  public isTenantGroupUserContainer: boolean = false;
  public isEditTenantGroupUserContainer: boolean = false;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  //public tenantGroupUserList: any[] = [
  //  { FirstName: 'Allan', LastName: 'Finch', EmailAddress: 'allan.finch@nis.com', ContactNumber: '9734667889', CountryCode: '+91', CountryId: 1 },
  //  { FirstName: 'Glenn', LastName: 'Steyn', EmailAddress: 'glenn.styen@nis.com', ContactNumber: '5235674356', CountryCode: '+91', CountryId: 1 },
  //  { FirstName: 'Dean', LastName: 'Jones', EmailAddress: 'dean.jones@nis.com', ContactNumber: '6756734567', CountryCode: '+91', CountryId: 1 },
  //];

  public tenantGroupUserList: any[] = [];
  public tenant: Tenant;
  public array: any;
  FirstChar: string;
  SecondChar: string
  public tenantGroupFormGroup: FormGroup;
  public tenantGroupUserFormGroup: FormGroup;
  public tenantGroupUserEditFormGroup: FormGroup;
  public updateOperationMode: boolean;
  public params: any = [];
  public tenantgroup: Tenant;
  public isTenantDetailsLoaded = false;
  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public onlyAlphabetsWithSpaceQuoteHyphen = "[a-zA-Z]+[ ]{0,1}[a-zA-Z]*[ ]*$";
  public onlyCharacterswithInbetweenSpaceUpto50Characters = Constants.onlyCharacterswithInbetweenSpaceUpto50Characters;
  public onlyNumbers = '[0-9]*';
  public tenantGroupUserFormErrorObject: any = {
    showCountryCodeError: false,
  };

  displayedColumns: string[] = ['FirstName', 'LastName', 'EmailAddress', 'ContactNumber', 'actions'];
  public tenantGroupUserIdentifier = 0;
  public TenantGroupUser: any = { Identifier: 0, CountryCode: 0, EmailAddress: '' };
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public countryList = [{ "Identifier": 0, "Code": "Please Select", "DialingCode": "" }];
  dataSource = new MatTableDataSource<any>(this.tenantGroupUserList);
  public roleObject:any = {};

  constructor(private _location: Location,
    private _router: Router,
    private service: UserService,
    private _activatedRouter: ActivatedRoute,
    private _http: HttpClient,
    private _spinnerService: NgxUiLoaderService,
    private formbuilder: FormBuilder,
    private _messageDialogService: MessageDialogService,
    private tenantService: TenantService,
    private injector: Injector) {
    this.tenant = new Tenant;
    this.tenantgroup = new Tenant;
    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/tenantgroups/Add')) {
          this.updateOperationMode = false;
          localStorage.removeItem("tenantgroupparams");
        }
      }
    });

    if (localStorage.getItem("tenantgroupparams")) {
      this.updateOperationMode = true;
    } else {
      this.updateOperationMode = false;
    }

    _router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/tenantgroups')) {
          //set passing parameters to localstorage.
          this.params = JSON.parse(localStorage.getItem('tenantgroupparams'));
          if (localStorage.getItem('tenantgroupparams')) {
            this.tenantgroup.TenantCode = this.params.Routeparams.passingparams.TenantGroupCode;
          }
        } else {
          localStorage.removeItem("tenantgroupparams");
        }
      }
    });
  }

  get tenantGroupName() {
    return this.tenantGroupFormGroup.get('tenantGroupName');
  }

  get tenantGroupDescription() {
    return this.tenantGroupFormGroup.get('tenantGroupDescription');
  }

  get firstName() {
    return this.tenantGroupUserFormGroup.get('firstName');
  }

  get lastName() {
    return this.tenantGroupUserFormGroup.get('lastName');
  }

  get email() {
    return this.tenantGroupUserFormGroup.get('email');
  }

  get countryCode() {
    return this.tenantGroupUserFormGroup.get('countryCode');
  }

  get mobileNumber() {
    return this.tenantGroupUserFormGroup.get('mobileNumber');
  }

  get EditfirstName() {
    return this.tenantGroupUserEditFormGroup.get('EditfirstName');
  }

  get EditlastName() {
    return this.tenantGroupUserEditFormGroup.get('EditlastName');
  }

  get Editemail() {
    return this.tenantGroupUserEditFormGroup.get('Editemail');
  }

  get EditcountryCode() {
    return this.tenantGroupUserEditFormGroup.get('EditcountryCode');
  }

  get EditmobileNumber() {
    return this.tenantGroupUserEditFormGroup.get('EditmobileNumber');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.dataSource = part;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {

    this.tenantGroupFormGroup = this.formbuilder.group({
      tenantGroupName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
      tenantGroupDescription: ['', Validators.compose([Validators.maxLength(500)])],
    });

    this.tenantGroupUserFormGroup = this.formbuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyCharacterswithInbetweenSpaceUpto50Characters)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyCharacterswithInbetweenSpaceUpto50Characters)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      mobileNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.onlyNumbers)])],
      CountryCode: [0],
    });

    this.tenantGroupUserEditFormGroup = this.formbuilder.group({
      EditfirstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyCharacterswithInbetweenSpaceUpto50Characters)])],
      EditlastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.onlyCharacterswithInbetweenSpaceUpto50Characters)])],
      Editemail: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      EditmobileNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.onlyNumbers)])],
      EditCountryCode: [0],
    });

    if (this.updateOperationMode) {
      this.getTenantGroups();
      this.getTenantGroupManagerRole();
    }
    this.getCountries();
  }

  async getTenantGroupManagerRole() {
    let roleService = this.injector.get(RoleService);
    let searchParameter: any = {};
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = this.currentPage + 1;
    searchParameter.PagingParameter.PageSize = this.pageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = "Id";
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Contains;
    searchParameter.Name = "Group Manager";
    var response = await roleService.getRoles(searchParameter);
    let _list = response.roleList;
    this.roleObject = _list[0];
  }

  async getTenantGroups() {
    let tenantService = this.injector.get(TenantService);
    var searchParameter: any = {};
    searchParameter.IsActive = true;
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = 'Id';
    searchParameter.SortParameter.SortOrder = Constants.Descending;
    searchParameter.SearchMode = Constants.Exact;
    searchParameter.TenantCode = this.tenantgroup.TenantCode;
    var response = await tenantService.getTenant(searchParameter);
    var tenantList = response.List;
    this.tenant = tenantList[0];
    this.isTenantDetailsLoaded = true;
    if (tenantList.length == 0) {
      this._messageDialogService.openDialogBox('Error', "Tenant Group Not Found", Constants.msgBoxError);
    }
    this.BindTenantGroupUsers();
    this.tenantgroup = tenantList[0];
    this.tenantGroupFormGroup.controls['tenantGroupName'].setValue(tenantList[0].TenantName);
    this.tenantGroupFormGroup.controls['tenantGroupDescription'].setValue(tenantList[0].TenantDescription);
  }

  async getCountries() {
    let searchParameter: any = {};
    searchParameter.PagingParameter = {};
    searchParameter.PagingParameter.PageIndex = Constants.DefaultPageIndex;
    searchParameter.PagingParameter.PageSize = Constants.DefaultPageSize;
    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = Constants.Name;
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Contains;
    let countryService = this.injector.get(CountryService);
    var response = await countryService.getCountrys(searchParameter);
    var copy = response.List;
    copy.forEach(country => {
      this.countryList.push(country);
    })
    if (this.updateOperationMode) {
      //this.getTenants();
    }
  }

  ShowAddEditTenantGroupUserContainer(action, tenantgroupuser): void {
    if (action == "Add") {
      this.isTenantGroupUserContainer = true;
      this.tenantGroupUserFormGroup.patchValue({ firstName: '', lastName: '', email: '', mobileNumber: '', CountryCode: 0 });
      this.markFormGroupUnTouched(this.tenantGroupUserFormGroup);
    }
    else {
      var number;
      if (this.updateOperationMode) {
        number = tenantgroupuser.ContactNumber.split("-")[1];
        this.tenantGroupUserIdentifier = tenantgroupuser.Identifier;
        this.TenantGroupUser.EmailAddress = tenantgroupuser.EmailAddress;
      }
      else {
        this.tenantGroupUserIdentifier = 0;
        number=tenantgroupuser.ContactNumber;
        this.TenantGroupUser.EmailAddress = '';
      }
      this.isEditTenantGroupUserContainer = true;
      this.tenantGroupUserEditFormGroup.patchValue({
        EditfirstName: tenantgroupuser.FirstName,
        EditlastName: tenantgroupuser.LastName,
        Editemail: tenantgroupuser.EmailAddress,
        EditmobileNumber: number,
        EditCountryCode: tenantgroupuser.CountryId
      }
      );
    }
  }

  CloseAddEditTenantGroupUserContainer(action): void {
    if (action == "Add") {
      this.isTenantGroupUserContainer = false;
    }
    else {
      this.isEditTenantGroupUserContainer = false;
    }
    this.resetTenantGroupUserForm(action);
  }

  navigateToListPage() {
    this._router.navigate(['/tenantgroups']);
  }

  tenantGroupUserFormValidation(action): boolean {
    if (action == 'Edit') {
      if (this.tenantGroupUserEditFormGroup.controls.EditfirstName.invalid) {
        return true;
      }
      if (this.tenantGroupUserEditFormGroup.controls.EditlastName.invalid) {
        return true;
      }
      if (this.tenantGroupUserEditFormGroup.controls.Editemail.invalid) {
        return true;
      }
      if (this.tenantGroupUserEditFormGroup.controls.EditmobileNumber.invalid) {
        return true;
      }
      if (this.TenantGroupUser.EditCountryCode == 0 && this.tenantGroupUserEditFormGroup.value.EditmobileNumber != '') {
        return true;
      }
      if (this.TenantGroupUser.EditCountryCode != 0 && this.tenantGroupUserEditFormGroup.value.EditmobileNumber == '') {
        return true;
      }
      return false;
    }
    else {
      if (this.tenantGroupUserFormGroup.controls.firstName.invalid) {
        return true;
      }
      if (this.tenantGroupUserFormGroup.controls.lastName.invalid) {
        return true;
      }
      if (this.tenantGroupUserFormGroup.controls.email.invalid) {
        return true;
      }
      if (this.tenantGroupUserFormGroup.controls.mobileNumber.invalid) {
        return true;
      }
      if (this.TenantGroupUser.CountryCode == 0 && this.tenantGroupUserFormGroup.value.mobileNumber != '') {
        return true;
      }
      if (this.TenantGroupUser.CountryCode != 0 && this.tenantGroupUserFormGroup.value.mobileNumber == '') {
        return true;
      }
      return false;
    }
  }

  public onCountrySelected(event) {
    const value = event.target.value;
    if (value == "0") {
      //this.tenantGroupUserFormErrorObject.showCountryCodeError = true;
      this.TenantGroupUser.CountryCode = 0;
    }
    else {
      //this.tenantGroupUserFormErrorObject.showCountryCodeError = false;
      this.TenantGroupUser.CountryCode = value;
    }
  }

  async BindTenantGroupUsers() {
    let searchParameter: any = {};
    searchParameter.PagingParameter = {};

    searchParameter.SortParameter = {};
    searchParameter.SortParameter.SortColumn = Constants.UserName;
    searchParameter.SortParameter.SortOrder = Constants.Ascending;
    searchParameter.SearchMode = Constants.Contains;
    searchParameter.TenantCode = this.tenant.TenantCode;
    searchParameter.IsGroupManager = true;
    searchParameter.IsActive = true;
    var response = await this.service.getUser(searchParameter);
    var userList = response.usersList;
    // this.totalRecordCount = response.RecordCount;
    this.tenantGroupUserList = userList
    this.dataSource = new MatTableDataSource<any>(this.tenantGroupUserList);
    this.dataSource.sort = this.sort;
    this.array = this.tenantGroupUserList;
    this.totalSize = this.array.length;
    this.iterator();
  }

  async onSubmitAddTenantGroupUser() {
    var country = this.countryList.filter(c => this.tenantGroupUserFormGroup.value.CountryCode == c.Identifier);
    let tenantGroupUserObject: any = {
      "FirstName": this.tenantGroupUserFormGroup.value.firstName.trim(),
      "LastName": this.tenantGroupUserFormGroup.value.lastName.trim(),
      "EmailAddress": this.tenantGroupUserFormGroup.value.email,
      "ContactNumber": this.tenantGroupUserFormGroup.value.mobileNumber,
      "CountryId": this.tenantGroupUserFormGroup.value.CountryCode,
      "CountryCode": country[0].DialingCode,
      "Identifier": 0,
      "IsActive": true,
      "IsActivationLinkSent": false
    };

    if (this.updateOperationMode) {
      var data = [];
      data.push(tenantGroupUserObject)
      tenantGroupUserObject.TenantCode=this.tenant.TenantCode;
      let tenantService = this.injector.get(TenantService);
      let isRecordSaved = await tenantService.saveGroupManager(data, false);
      if (isRecordSaved) {
        let message = Constants.recordAddedMessage;
        if (this.updateOperationMode) {
          message = Constants.recordUpdatedMessage;
        }
        this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
        this.BindTenantGroupUsers();
      }
    }
    else {
      var contacts = [];
      contacts = this.tenantGroupUserList.filter(s => tenantGroupUserObject.EmailAddress == s.EmailAddress);
      if (contacts.length > 0) {
        this._messageDialogService.openDialogBox('Error', "Duplicate tenant contact found", Constants.msgBoxSuccess);
      }
      else {
        this.tenantGroupUserList.push(tenantGroupUserObject);
        //let messageString = Constants.recordAddedMessage;
        //this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
        this.dataSource = new MatTableDataSource<any>(this.tenantGroupUserList);
        this.dataSource.sort = this.sort;
        this.array = this.tenantGroupUserList;
        this.totalSize = this.array.length;
        this.iterator();
        this.CloseAddEditTenantGroupUserContainer('Add');
      }
    }
    this.CloseAddEditTenantGroupUserContainer('Add');

  }

  async UpdateTenantGroupUser() {
    var country = this.countryList.filter(c => this.tenantGroupUserEditFormGroup.value.EditCountryCode == c.Identifier);
    var tenantgroupuser = this.tenantGroupUserList.filter(s => this.TenantGroupUser.EmailAddress == s.EmailAddress)[0];
    var index = this.tenantGroupUserList.findIndex(s => this.TenantGroupUser.EmailAddress == s.EmailAddress);
    this.tenantGroupUserList.splice(index, 1);
    let tenantGroupUserObject: any = {
      "FirstName": this.tenantGroupUserEditFormGroup.value.EditfirstName.trim(),
      "LastName": this.tenantGroupUserEditFormGroup.value.EditlastName.trim(),
      "EmailAddress": this.tenantGroupUserEditFormGroup.value.Editemail,
      "ContactNumber": this.tenantGroupUserEditFormGroup.value.EditmobileNumber,
      "CountryId": this.tenantGroupUserEditFormGroup.value.EditCountryCode,
      "CountryCode": country[0].DialingCode,
      "Identifier": tenantgroupuser.Identifier,
      "IsActive": true,
      "IsActivationLinkSent": false,
      "TenantCode": tenantgroupuser.TenantCode
    };

    if (this.updateOperationMode) {
      var data = [];
      let roleArray = [];
      roleArray.push({
        "Identifier": this.roleObject.Identifier,
        "Name": this.roleObject.Name,
      });
      tenantGroupUserObject.Roles = roleArray;
      data.push(tenantGroupUserObject);
      this._spinnerService.start();
      this.service.saveUser(data, true).subscribe(data => {
        this._spinnerService.stop();
        if (data == true) {
          let message = Constants.recordAddedMessage;
          if (this.updateOperationMode) {
            message = Constants.recordUpdatedMessage;
          }
          this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
          this.BindTenantGroupUsers();
        }
      }, (error: any) => {
        this._messageDialogService.openDialogBox('Error', error.error.Message, Constants.msgBoxError);
        this._spinnerService.stop();
      });
    }
    else {
      var contacts = [];
      contacts = this.tenantGroupUserList.filter(s => tenantGroupUserObject.EmailAddress == s.EmailAddress);
      if (contacts.length > 0) {
        this._messageDialogService.openDialogBox('Error', "Duplicate tenant contact found", Constants.msgBoxSuccess);
      }
      else {
        this.tenantGroupUserList.forEach(item => {
          if (item.EmailAddress == tenantGroupUserObject.EmailAddress) {
            item = tenantGroupUserObject;
          }
        });
        this.dataSource = new MatTableDataSource<any>(this.tenantGroupUserList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    this.CloseAddEditTenantGroupUserContainer('Edit');
  }

  async DeleteTenantGroupUser(tenantgroup) {
    if (this.updateOperationMode) {
      let message = "Are you sure you want to delete this record?";
      this._messageDialogService.openConfirmationDialogBox('Confirm', message, Constants.msgBoxWarning).subscribe(async (isConfirmed) => {
        if (isConfirmed) {
          var data=[];
          data.push(tenantgroup);
          let isDeleted = await this.service.deleteUser(data);
          if (isDeleted) {
            let messageString = Constants.recordDeletedMessage;
            this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
            this.BindTenantGroupUsers();
          }
        }
      });
    }
    else {
      var index = this.tenantGroupUserList.findIndex(s => tenantgroup.EmailAddress == s.EmailAddress);
      this.tenantGroupUserList.splice(index, 1);
      let messageString = Constants.recordDeletedMessage;
      this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
      this.dataSource = new MatTableDataSource<any>(this.tenantGroupUserList);
      this.dataSource.sort = this.sort;
      this.array = this.tenantGroupUserList;
      this.totalSize = this.array.length;
      this.iterator();
    }
  }

  validateTenantGroupForm() {
    if (this.tenantGroupFormGroup.invalid) {
      return true;
    }
    return false;
  }

  async saveTenantGroupUser() {
    let messageString = "Tenant group added successfully";
    if (this.updateOperationMode) {
      messageString = "Tenant group updated successfully";
    }
    this._messageDialogService.openDialogBox('Success', messageString, Constants.msgBoxSuccess);
  }

  resetTenantGroupUserForm(action) {
    if (action == 'Add') {
      this.tenantGroupUserFormGroup.patchValue({ firstName: null, lastName: null, email: null, mobileNumber: null, CountryCode: null });
    } else {
      this.tenantGroupUserEditFormGroup.patchValue({ EditfirstName: null, EditlastName: null, Editemail: null, EditmobileNumber: null, EditCountryCode: null });
    }

    this.TenantGroupUser.EmailAddress = '';
    this.TenantGroupUser.CountryCode = 0;
    this.tenantGroupUserFormErrorObject.showCountryCodeError = false;
  }

  private markFormGroupUnTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsUntouched();

      if (control.controls) {
        this.markFormGroupUnTouched(control);
      }
    });
  }

  async saveTenant() {
    if (this.tenantGroupUserList.length <= 0) {
      this._messageDialogService.openDialogBox('Error', "Please add at least one tenant group user", Constants.msgBoxSuccess);
    }
    else {
      this.tenant.TenantName = this.tenantGroupFormGroup.value.tenantGroupName;
      this.tenant.TenantDescription = this.tenantGroupFormGroup.value.tenantGroupDescription;
      this.tenant.TenantType = "Group";
      var userid = localStorage.getItem('UserId');
      this.tenant.TenantContacts = this.tenantGroupUserList;
      this.tenant.User = {};
      this.tenant.User.Identifier = userid;
      let pageArray = [];
      pageArray.push(this.tenant);
      let tenantService = this.injector.get(TenantService);
      let isRecordSaved = await tenantService.saveTenant(pageArray, this.updateOperationMode);
      if (isRecordSaved) {
        let message = Constants.recordAddedMessage;
        if (this.updateOperationMode) {
          message = Constants.recordUpdatedMessage;
        }
        this._messageDialogService.openDialogBox('Success', message, Constants.msgBoxSuccess);
        this.navigateToListPage()

      }
    }

  }

  getUserInformation(): void {
    this.isCollapsedTenantGroupUsers = !this.isCollapsedTenantGroupUsers;
    if (!this.isCollapsedTenantGroupUsers) {
      if (this.tenant.TenantCode != null && this.tenant.TenantCode != '') {
        if (this.tenant.TenantContacts == null || this.tenant.TenantContacts.length == 0) {
          this.BindTenantGroupUsers();
        }

      }

    }

  }

}
