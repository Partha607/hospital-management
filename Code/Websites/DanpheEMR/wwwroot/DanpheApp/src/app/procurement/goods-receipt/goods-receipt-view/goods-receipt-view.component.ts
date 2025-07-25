import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CoreService } from '../../../core/shared/core.service';
import { InventoryService } from '../../../inventory/shared/inventory.service';
import { GeneralFieldLabels } from '../../../shared/DTOs/general-field-label.dto';
import { InventoryFieldCustomizationService } from '../../../shared/inventory-field-customization.service';
import { MessageboxService } from '../../../shared/messagebox/messagebox.service';
import { ProcurementBLService } from '../../shared/procurement.bl.service';
import { GoodsReceiptItems } from '../goods-receipt-item.model';
import { GoodsReceipt } from '../goods-receipt.model';

@Component({
  selector: 'app-goods-receipt-view',
  templateUrl: './goods-receipt-view.component.html',
  host: { '(window:keydown)': 'KeysPressed($event)' },
  styles: []
})
export class GoodsReceiptViewComponent implements OnInit {


  public goodsreceiptID: number = null;
  public goodsreceiptDetails: GoodsReceipt = new GoodsReceipt();
  public goodsreceiptItemsDetails: Array<GoodsReceiptItems> = new Array<GoodsReceiptItems>();
  public header: any = null;
  msgBoxServ: any;
  creator: any = new Object();
  public editGR: boolean = false;
  public showNepaliReceipt: boolean;
  printDetaiils: HTMLElement;
  showPrint: boolean;
  verifierDetails: any[] = [];
  showSpecification: boolean = false;
  public GeneralFieldLabel = new GeneralFieldLabels();

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    public procBLService: ProcurementBLService,
    public inventoryService: InventoryService,
    public messageBoxService: MessageboxService,
    public router: Router,
    public coreservice: CoreService, public inventoryFieldCustomizationService: InventoryFieldCustomizationService) {
    this.GeneralFieldLabel = coreservice.GetFieldLabelParameter();
    this.LoadGoodsReceiptDetails(this.inventoryService.GoodsReceiptId);
    this.header = JSON.parse(this.coreservice.Parameters[1].ParameterValue);
    this.GetInventoryBillingHeaderParameter();
    this.GetInventoryFieldCustomization();
  }

  ngOnInit() {
    let receipt = this.coreservice.Parameters.find(lang => lang.ParameterName == 'NepaliReceipt' && lang.ParameterGroupName == 'Common').ParameterValue;
    this.showNepaliReceipt = (receipt == "true");
    this.FocusElementById("printbtn");
  }
  private FocusElementById(id: string) {
    window.setTimeout(function () {
      let itmNameBox = document.getElementById(id);
      if (itmNameBox) {
        itmNameBox.focus();
      }
    }, 600);
  }
  LoadGoodsReceiptDetails(id: number) {
    if (id != null) {
      this.goodsreceiptID = id;

      this.procBLService.GetProcurementGRView(this.goodsreceiptID)
        .subscribe(res => this.ShowGoodsReceiptDetails(res));
    }
    else {
      this.messageBoxService.showMessage("notice-message", ['Please, Select GoodsReceipt for Details.']);
      this.goodsreceiptList();
    }
  }
  ngOnDestroy() {
    if (this.editGR == false) {
      this.inventoryService.GoodsReceiptId = 0;
    }
  }

  ShowGoodsReceiptDetails(res) {
    if (res.Status == "OK") {
      this.goodsreceiptItemsDetails = res.Results.grItems;
      this.creator = res.Results.creator;
      this.goodsreceiptDetails = res.Results.grDetails;
      this.verifierDetails = res.Results.verifier;
      if (this.goodsreceiptItemsDetails.length > 0) {
        this.goodsreceiptItemsDetails.forEach(itm => {
          if (itm.ExpiryDate != null)
            itm.ExpiryDate = moment(itm.ExpiryDate).format('DD-MM-YYYY');
        });
        this.goodsreceiptDetails.GoodsArrivalDate = moment(this.goodsreceiptDetails.GoodsArrivalDate).format('YYYY-MM-DD');
        this.goodsreceiptDetails.GoodsReceiptDate = moment(this.goodsreceiptDetails.GoodsReceiptDate).format('YYYY-MM-DD');
        this.goodsreceiptDetails.ReceivedDate = moment(this.goodsreceiptDetails.ReceivedDate).format('YYYY-MM-DD');
        this.goodsreceiptDetails.CreatedOn = moment(this.goodsreceiptDetails.CreatedOn).format('YYYY-MM-DD');
        this.goodsreceiptDetails.VendorBillDate = moment(this.goodsreceiptDetails.VendorBillDate).format('YYYY-MM-DD');
        this.goodsreceiptDetails.GoodsReceiptItem = this.goodsreceiptItemsDetails;
      }
      else {
        this.messageBoxService.showMessage("notice-message", ["Selected GoodsReceipt is without Items"]);
        this.goodsreceiptList();
      }
    }
    else {
      this.messageBoxService.showMessage("notice-message", ["There is no GoodsReceipt details !"]);
      this.goodsreceiptList();
    }
  }
  //this is used to print the receipt
  print() {
    // this.printDetaiils = document.getElementById("printpage");
    // this.showPrint = true;
    let popupWinindow;
    var printContents = document.getElementById("printpage").innerHTML;
    popupWinindow = window.open('', '_blank', 'width=1000,heigth=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write(`
       <html>
         <head>
         <style>
           .img-responsive{ position: relative;top: 10px;}
           .qr-code{position:relative;}
           .no-print{display:none;}
           @page { size: auto;  margin: 1000px; }
           .cancelStamp {transform: rotate(12deg);color: #555;font-size: 3rem;font-weight: 700;border: 0.25rem solid #555;display: inline-block;padding: 0.25rem 0;text-transform: uppercase;border-radius: 1rem;font-family: 'Courier';mix-blend-mode: multiply;color: #D23;border: 0.5rem solid #D23;transform: rotate(-14deg);border-radius: 0;}
         </style>
         <link rel="stylesheet" type="text/css" href="../../../themes/theme-default/ReceiptList.css" />
         </head>
         <body onload="window.print()">`
      + printContents +
      `</body>
       </html>`);
    popupWinindow.document.close();

  }
  callBackPrint() {
    this.printDetaiils = null;
    this.showPrint = false;
  }
  //route to goods receipt list page
  goodsreceiptList() {
    this.router.navigate(['/ProcurementMain/GoodsReceipt/GoodsReceiptList']);
  }
  cancelGR() {
    if (this.goodsreceiptItemsDetails[0].IsTransferredToACC == true) {
      this.messageBoxService.showMessage("Access Denied", ["This Receipt has been transferred to Accounting", "Cancelling is forbidden."]);
    }
    else {
      this.procBLService.PostGoodsReceiptCancelDetail(this.goodsreceiptDetails.GoodsReceiptID, this.goodsreceiptDetails.CancelRemarks)
        .subscribe(
          res => {
            if (res.Status == "OK") {
              this.goodsreceiptList();
              this.messageBoxService.showMessage("Success", ["Goods Receipt Cancelled"]);
            }
            else {
              this.messageBoxService.showMessage("Error", [res.ErrorMessage]);
            }
          },
          err => {
            this.messageBoxService.showMessage("Error", [err.ErrorMessage]);
          });
    }
  }

  editReceipt() {
    if (this.goodsreceiptItemsDetails[0].IsTransferredToACC == true) {
      this.messageBoxService.showMessage("Access Denied", ["This receipt has been transfered to accounting.", "Further editing is forbidden."]);
    }
    else {
      this.editGR = true;
      //this.inventoryService.Id = this.goodsreceiptDetails.GoodsReceiptID;//sud:19Feb'20: changed after adding GoodsReceiptId field in service.
      this.inventoryService.GoodsReceiptId = this.goodsreceiptDetails.GoodsReceiptID;
      this.router.navigate(['/ProcurementMain/GoodsReceipt/GoodsReceiptAdd']);
      this.editGR = true;
    }
  }
  public headerDetail: { header1, header2, header3, header4, hospitalName, address, email, PANno, tel, DDA };

  //Get Pharmacy Billing Header Parameter from Core Service (Database) assign to local variable
  GetInventoryBillingHeaderParameter() {
    var paramValue = this.coreservice.Parameters.find(a => a.ParameterName == 'Inventory Receipt Header').ParameterValue;
    if (paramValue)
      this.headerDetail = JSON.parse(paramValue);
    else
      this.msgBoxServ.showMessage("error", ["Please enter parameter values for BillingHeader"]);
  }

  KeysPressed(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.closeModal.nativeElement.click();
    }
  }
  GetInventoryFieldCustomization(): void {
    let parameter = this.inventoryFieldCustomizationService.GetInventoryFieldCustomization();
    this.showSpecification = parameter.showSpecification;
  }
}
export class Charge {
  ChargeName: string = "";
  TotalAmount: number = 0;
}