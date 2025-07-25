import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CoreService } from '../../../core/shared/core.service';
import { DispensaryService } from '../../../dispensary/shared/dispensary.service';
import { SecurityService } from '../../../security/shared/security.service';
import { DanpheHTTPResponse } from '../../../shared/common-models';
import { MessageboxService } from '../../../shared/messagebox/messagebox.service';
import { ENUM_DanpheHTTPResponses, ENUM_MessageBox_Status, ENUM_StoreCategory } from '../../../shared/shared-enums';
import { SharedModule } from '../../../shared/shared.module';
import { PharmacyStoreStockDetail } from '../../shared/dtos/pharmacy-store-stock-detail';
import { PharmacyStore_DTO } from '../../shared/dtos/pharmacy-store.dto';
import { PharmacyBLService } from '../../shared/pharmacy.bl.service';
import { PharmacyService } from '../../shared/pharmacy.service';
import { PHRMStoreDispatchItems } from '../../shared/phrm-store-dispatch-items.model';

@Component({
  selector: 'app-direct-dispatch',
  templateUrl: './direct-dispatch.component.html',
  styleUrls: ['./direct-dispatch.component.css']
})
export class DirectDispatchComponent implements OnInit {

  public dispatchItems: Array<PHRMStoreDispatchItems> = new Array<PHRMStoreDispatchItems>();
  public stockList: PharmacyStoreStockDetail[] = [];
  public checkIsItemPresent: boolean = false;
  public dispensaryList: Array<PharmacyStore_DTO> = new Array<PharmacyStore_DTO>();
  public filteredDispensaryList: Array<PharmacyStore_DTO> = new Array<PharmacyStore_DTO>();
  public selectedDispensary: any;
  //for double click issues.
  public loading: boolean = false;
  isSelectedDispensaryInsurance: boolean;
  itemList: any[];
  directDispatchForm = new FormGroup({ targetStore: new FormControl('', Validators.required), Remarks: new FormControl('', Validators.required), ReceivedBy: new FormControl('') });
  public genericList: Array<any>;
  FilteredItemList: any[];
  showGenericName: boolean = false;
  ToRackNo: string = null;
  Stores: PharmacyStore_DTO[] = [];
  showSubstore: boolean = false;
  DispatchId: number = null;

  DispatchNo: number = null;
  IssueNo: number = null;
  constructor(private _dispensaryService: DispensaryService,
    public changeDetectorRef: ChangeDetectorRef, public pharmacyBLService: PharmacyBLService,
    public securityService: SecurityService, public pharmacyService: PharmacyService,
    public router: Router, public sharedModule: SharedModule,
    public messageBoxService: MessageboxService,
    public coreService: CoreService, private _pharmacyService: PharmacyService) {
    ////pushing currentPOItem for the first Row in UI 
    this.AddRowRequest();
    this.GetStockForItemDispatch();
    this.GetStoresList();
    this.getGenericList();
    this.getPharmacyItemNameDisplaySettings();
  }
  ngOnInit() {
  }
  GetStockForItemDispatch() {
    this.stockList = this.pharmacyService.getStockForItemDispatch();
  }
  GetStoresList() {
    // this._dispensaryService.GetAllDispensaryList()
    //   .subscribe(res => {
    //     if (res.Status == "OK") {
    //       this.dispensaryList = JSON.parse(JSON.stringify(res.Results));
    //       this.dispensaryList = this.dispensaryList.filter(a => a.IsActive != false);
    //       this.SetFocusById("dispensary");
    //     }
    //   })
    this.dispensaryList = this.pharmacyService.Stores;
    this.FilterStores();
    this.SetFocusById("dispensary");
  }
  ////add a new row 
  AddRowRequest() {
    let newDispatchItem = new PHRMStoreDispatchItems();
    this.dispatchItems.push(newDispatchItem);
    this.itemList = this.stockList;
  }
  //to delete the row
  DeleteRow(index) {
    try {
      this.dispatchItems.splice(index, 1);
      if (this.dispatchItems.length == 0) {
        this.AddRowRequest();
        this.SetFocusOnItemName(1);
      }
    }
    catch (exception) {
      this.messageBoxService.showMessage("Error", [exception]);
    }
  }

  SelectItemFromSearchBox(Item: any, index) {
    //if proper item is selected then the below code runs ..othewise it goes out side the function
    if (typeof Item === "object" && !Array.isArray(Item) && Item !== null) {
      //this for loop with if conditon is to check whether the  item is already present in the array or not
      //means to avoid duplication of item
      let IsItemExpired: boolean = false;
      IsItemExpired = this.CheckIfItemExpired(Item);
      if (!IsItemExpired) {
        for (var i = 0; i < this.dispatchItems.length; i++) {
          if (this.dispatchItems[i].ItemId == Item.ItemId && this.dispatchItems[i].BatchNo == Item.BatchNo && this.dispatchItems[i].CostPrice == Item.CostPrice && index != i) {
            this.checkIsItemPresent = true;
          }
        }
        //id item is present the it show alert otherwise it assign the value
        if (this.checkIsItemPresent == true) {
          this.messageBoxService.showMessage("notice-message", [`Item: ${Item.ItemName} Batch: ${Item.BatchNo} CostPrice: ${Item.CostPrice} is already add..Please Check!!!`]);
          this.checkIsItemPresent = false;
          this.changeDetectorRef.detectChanges();
          this.dispatchItems.splice(index, 1);
          this.AddRowRequest();
          var interval = setTimeout(() => { this.SetFocusOnItemName(index); clearTimeout(interval); }, 300);

        }
        else {
          this.dispatchItems[index].ItemId = Item.ItemId;
          this.dispatchItems[index].ItemCode = Item.Code;
          this.dispatchItems[index].UOMName = Item.UOMName;
          this.dispatchItems[index].BatchNo = Item.BatchNo;
          this.dispatchItems[index].ExpiryDate = Item.ExpiryDate;
          this.dispatchItems[index].AvailableQuantity = Item.AvailableQuantity;
          this.dispatchItems[index].SalePrice = Item.SalePrice;
          this.dispatchItems[index].CostPrice = Item.CostPrice;

          let selectedGeneric = this.genericList.filter(a => a.GenericId == Item.GenericId)
          this.dispatchItems[index].selectedGeneneric = selectedGeneric[0];
          this.dispatchItems[index].GenericId = Item.GenericId;
          this.dispatchItems[index].RackNo = Item.RackNo;
          this.GetRackByItemId(Item.ItemId, this.dispatchItems[0].TargetStoreId, index);

        }
      }
      else {
        this.dispatchItems[index] = new PHRMStoreDispatchItems();
      }
    }
  }
  DirectDispatch() {
    if (this.showSubstore && !this.IssueNo) {
      return this.messageBoxService.showMessage(ENUM_DanpheHTTPResponses.Failed, ["Issue No is required for direct dispatch to Sub Store"]);
    }
    let errorMessages: Array<string> = [];
    let CheckIsValid = true;
    for (let b in this.directDispatchForm.controls) {
      this.directDispatchForm.controls[b].markAsDirty();
      this.directDispatchForm.controls[b].updateValueAndValidity();
    }
    if (this.directDispatchForm.invalid) {
      CheckIsValid = false;
      this.messageBoxService.showMessage("Failed", ["Check all *mandatory fields."])
    }
    else {
      for (let i = 0; i < this.dispatchItems.length; i++) {
        //Assign all the dispatchitems with the zero index dispatch items as we are saving all the details in only first dispatch item. 
        this.dispatchItems[i].TargetStoreId = this.selectedDispensary.StoreId;
        this.dispatchItems[i].DispatchedDate = this.dispatchItems[0].DispatchedDate;
        this.dispatchItems[i].Remarks = this.directDispatchForm.get('Remarks').value;
        this.dispatchItems[i].ReceivedBy = this.directDispatchForm.get('ReceivedBy').value;
        this.dispatchItems[i].DispatchItemValidator.get("DispensaryId").setValue(this.dispatchItems[0].TargetStoreId);

        if (this.dispatchItems[i].DispatchedQuantity > this.dispatchItems[i].AvailableQuantity) {
          CheckIsValid = false;
          errorMessages.push(`Dispatched Quantity is greater than Available Quantity for ${this.dispatchItems[i].SelectedItem.ItemName}`)
        }
        for (var a in this.dispatchItems[i].DispatchItemValidator.controls) {
          this.dispatchItems[i].DispatchItemValidator.controls[a].markAsDirty();
          this.dispatchItems[i].DispatchItemValidator.controls[a].updateValueAndValidity();
        }
        if (this.dispatchItems[i].IsValidCheck(undefined, undefined) == false) {
          CheckIsValid = false;
        }
      }
      if (this.dispatchItems && this.dispatchItems.length && this.dispatchItems.some(i => i.DispatchItemValidator.invalid)) {
        const InvalidItems = this.dispatchItems.filter(i => i.DispatchItemValidator.invalid);
        if (InvalidItems && InvalidItems.length) {
          InvalidItems.forEach(item => {
            errorMessages.push(`Some input fields are not valid for ${item.SelectedItem.ItemName}`);
          });
          CheckIsValid = false;
        }
      }
    }
    if (CheckIsValid == true) {
      if (this.showSubstore && this.IssueNo) {
        this.dispatchItems.forEach(item => item.IssueNo = this.IssueNo);
      }
      this.loading = true;
      this.pharmacyBLService.PostDirectDispatch(this.dispatchItems)
        .finally(() => this.loading = false)
        .subscribe((res: DanpheHTTPResponse) => {
          if (res.Status == ENUM_DanpheHTTPResponses.OK) {
            this.messageBoxService.showMessage("success", ["Dispatch done successfully."]);
            this.DispatchId = res.Results.Result;
            this.pharmacyService._Id = this.DispatchId;
            // this.router.navigate(["/Pharmacy/Store/StoreRequisition"]);
            this.router.navigate(["/Pharmacy/SubstoreRequestAndDispatch/Requisitions"]);
          }
          else {
            this.messageBoxService.showMessage(ENUM_MessageBox_Status.Failed, [res.ErrorMessage]);
          }
        });
    }
    else {
      this.messageBoxService.showMessage("Failed", errorMessages);
      this.loading = false;
    }
  }
  // used to select dispensary in autocomplete
  OnDispensaryChange() {
    let dispensary = null;
    if (!this.selectedDispensary) {
      this.dispatchItems[0].TargetStoreId = null;
    }
    else if (typeof (this.selectedDispensary) == 'string') {
      dispensary = this.dispensaryList.find(a => a.Name.toLowerCase() == this.selectedDispensary.toLowerCase());
    }
    else if (typeof (this.selectedDispensary) == "object") {
      dispensary = this.selectedDispensary;
    }
    if (dispensary) {
      this.dispatchItems[0].TargetStoreId = dispensary.StoreId;
      this.dispatchItems[0].DispatchItemValidator.get("DispensaryId").setValue(dispensary.StoreId);
    }
    else {
      this.dispatchItems[0].TargetStoreId = null;
    }
    this.FilterItemsBasedOnDispensaryType();
  }
  FilterItemsBasedOnDispensaryType() {
    if (this.selectedDispensary.SubCategory == "insurance") {
      if (this.dispatchItems[0].SelectedItem == undefined || this.dispatchItems[0].SelectedItem == " ") {
        this.dispatchItems = this.dispatchItems;
        console.log(this.dispatchItems);
      }
      else {
        this.dispatchItems = this.dispatchItems.filter(item => item.ItemId > 0 && item.ItemId != null);
        this.dispatchItems = this.dispatchItems.filter(item => item.SelectedItem.IsInsuranceApplicable == true);
        if (this.dispatchItems.length == 0) {
          this.AddRowRequest();
        }

      }
      this.itemList = this.stockList.filter(a => a.IsInsuranceApplicable == true);
    }
    else {
      this.itemList = this.stockList;
    }
  }


  DispensaryListFormatter(data: any): string {
    return data["Name"];
  }
  ////used to format display item in ng-autocomplete
  ItemListFormatter(data: any): string {
    let html = "";
    let date = new Date();
    let datenow = date.setMonth(date.getMonth() + 0);
    let datethreemonth = date.setMonth(date.getMonth() + 3);
    let expiryDate = new Date(data["ExpiryDate"]);
    let expDate = expiryDate.setMonth(expiryDate.getMonth() + 0);
    if (expDate < datenow) {
      html = `<font color='crimson'; size=03 >${data["ItemName"]}</font> <b>|Unit |${data["UOMName"]}</b> |E:${moment(data["ExpiryDate"]).format('YYYY-MM-DD')} |B.No.|${data["BatchNo"]} |Qty|${data["AvailableQuantity"]} |SalePrice|${data["SalePrice"]}`;
    }
    if (expDate < datethreemonth && expDate > datenow) {

      html = `<font  color='#FFBF00'; size=03 >${data["ItemName"]}</font><b>|Unit|${data["Unit"]}</b> |E:${moment(data["ExpiryDate"]).format('YYYY-MM-DD')} |B.No.|${data["BatchNo"]} |Qty|${data["AvailableQuantity"]} |SalePrice|${data["SalePrice"]}`;
    }
    if (expDate > datethreemonth) {
      html = `<font color='blue'; size=03 >${data["ItemName"]}</font> <b>|Unit |${data["UOMName"]}</b> |E:${moment(data["ExpiryDate"]).format('YYYY-MM-DD')} |B.No.|${data["BatchNo"]} |Qty|${data["AvailableQuantity"]} |SalePrice|${data["SalePrice"]}`;
    }
    return html;
  }
  Cancel() {
    this.dispatchItems = new Array<PHRMStoreDispatchItems>();
    this.AddRowRequest();
    //route back to requisition list
    // this.router.navigate(['/Pharmacy/Store/StoreRequisition']);
    this.router.navigate(['/Pharmacy/SubstoreRequestAndDispatch/Requisitions']);
  }
  logError(err: any) {
    console.log(err);
  }
  OnPressedEnterKeyInItemField(index) {
    if (this.dispatchItems[index].SelectedItem != null && this.dispatchItems[index].ItemId != null) {
      this.SetFocusById(`qtyip${index}`);
    }
    else {
      if (this.dispatchItems.length == 1) {
        this.SetFocusOnItemName(index)
      }
      else {
        this.dispatchItems.splice(index, 1);
        this.SetFocusById('remarks');
      }

    }
  }
  OnPressedEnterKeyInQuantityField(index) {
    var isinputvalid = this.dispatchItems.every(item => item.DispatchedQuantity > 0 && item.DispatchedQuantity <= item.AvailableQuantity)
    if (isinputvalid == true) {
      //If index is last element of array, then create new row
      if (index == (this.dispatchItems.length - 1)) {
        this.AddRowRequest();
      }
      if (this.showGenericName) {
        this.SetFocusById('generic' + (index + 1));
      }
      else {
        this.SetFocusOnItemName(index + 1);
      }
    }
  }
  public SetFocusOnItemName(index: number) {
    this.SetFocusById("itemName" + index);
  }

  SetFocusById(IdToBeFocused) {
    window.setTimeout(function () {
      var element = <HTMLInputElement>document.getElementById(IdToBeFocused);
      element.focus();
      //element.select();
    }, 20);
  }
  public getGenericList() {
    this.genericList = this.pharmacyService.GetGenericList();
  }
  phrmGenericListFormatter(data: any): string {
    let html = "";
    if (data["GenericId"]) {
      html = `<font color='blue'; size=03 >${data["GenericName"]}</font>`;
    }
    return html;
  }
  public AssignSelectedGenName(row, i) {
    try {
      if ((row.selectedGeneneric != 0) && (row.selectedGeneneric != null)) {
        this.itemList = this.stockList.filter(a => a.GenericId == row.selectedGeneneric.GenericId);
        this.dispatchItems[i].SelectedItem = null;
        row.ItemFieldMinChars = 0;
      }
      else {
        this.itemList = this.stockList;
        row.ItemFieldMinChars = 1;
        this.dispatchItems[i].SelectedItem = null;
        row.Quantity = 0;
      }
    } catch (ex) {
      this.ShowCatchErrMessage(ex);
    }
  }
  ShowCatchErrMessage(exception) {
    if (exception) {
      let ex: Error = exception;
      this.messageBoxService.showMessage("error", ["Check error in Console log !"]);
      console.log("Error Messsage =>  " + ex.message);
    }
  }
  getPharmacyItemNameDisplaySettings() {
    let checkGeneric = this.coreService.Parameters.find(p => p.ParameterName == "PharmacyItemNameDisplaySettings" && p.ParameterGroupName == "Pharmacy");
    if (checkGeneric != null) {
      let phrmItemNameSettingValue = JSON.parse(checkGeneric.ParameterValue);
      this.showGenericName = phrmItemNameSettingValue.Show_GenericName
    }
  }
  GetRackByItemId(ItemId: number, StoreId: number, index: number): void {
    this.pharmacyBLService.GetRackNoByItemIdAndStoreId(ItemId, StoreId)
      .subscribe((res: DanpheHTTPResponse) => {
        if (res.Status === ENUM_DanpheHTTPResponses.OK) {
          this.dispatchItems[index].ToRackNo = res.Results;
        }
        else {
          this.messageBoxService.showMessage(ENUM_MessageBox_Status.Failed, [res.ErrorMessage]);
        }
      });
  };

  FilterStores() {
    if (this.showSubstore) {
      this.filteredDispensaryList = this.dispensaryList.filter(a => a.Category === ENUM_StoreCategory.SubStore);
    }
    else {
      this.filteredDispensaryList = this.dispensaryList.filter(a => a.Category === ENUM_StoreCategory.Dispensary);
    }
  }

  ngOnDestroy() {
    this.stockList = [];
    this.pharmacyService.setStockForItemDispatch(this.stockList);
  }
  CheckIfItemExpired(Item): boolean {
    if (Item && Item.ExpiryDate) {
      let date = new Date();
      let datenow = date.setMonth(date.getMonth() + 0);
      let expiryDate = new Date(Item.ExpiryDate);
      let expDate = expiryDate.setMonth(expiryDate.getMonth() + 0);
      if (expDate < datenow) {
        this.messageBoxService.showMessage(ENUM_MessageBox_Status.Notice, ["Expired Item cannot be dispatched"])
        return true;
      }
      return false;
    }
  }
}

