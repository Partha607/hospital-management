import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { CoreService } from '../../core/shared/core.service';
import { SecurityService } from '../../security/shared/security.service';
import { NepaliCalendarService } from '../../shared/calendar/np/nepali-calendar.service';
import { CodeDetailsModel } from '../../shared/code-details.model';
import { CommonFunctions } from '../../shared/common.functions';
import { DanpheCache, MasterType } from '../../shared/danphe-cache-service-utility/cache-services';
import { MessageboxService } from '../../shared/messagebox/messagebox.service';
import { ENUM_ACC_ReportName, ENUM_ACC_ReportStaticName, ENUM_DateTimeFormat } from '../../shared/shared-enums';
import { LedgerModel } from '../settings/shared/ledger.model';
import { ledgerGroupModel } from '../settings/shared/ledgerGroup.model';
import { SectionModel } from '../settings/shared/section.model';
import { SubLedgerModel } from '../settings/shared/sub-ledger.model';
import { AccCacheDataVM } from './acc-view-models';

@Injectable()
export class AccountingService {
  public CodeData: Array<CodeDetailsModel> = new Array<CodeDetailsModel>();
  public VoucherNumber: string = null;
  public IsEditVoucher: boolean = false;
  public accCacheData: AccCacheDataVM = new AccCacheDataVM();//mumbai-team-june2021-danphe-accounting-cache-change
  public paramData = null;
  public paramExportToExcelData = null;
  public headerDetail: any;
  public fromDate: string = null;
  public toDate: string = null;
  public footerContent = '';
  public printBy: string = '';
  // public dateRange: string = '';
  public exportToExcelSettingParameter: string = '';
  public showPrint: boolean = false;
  public headerContent = '';
  public reportHeader: string = 'Report Data';
  public printTitle: string = "";
  public copyVoucherData: any;
  public selectedSectionId: number = 0;
  public voucherTxnData = {
    VoucherNumber: null,
    FiscalyearId: 0
  }
  public AllLedgerGroup: ledgerGroupModel[] = [];
  public AllLedgers: LedgerModel[] = [];
  public AllSubLedger: SubLedgerModel[] = [];
  public AllCodeDetails: CodeDetailsModel[] = [];
  public AllSections: SectionModel[] = [];

  @Output()
  dateRange: EventEmitter<any> = new EventEmitter<any>();
  constructor(public coreService: CoreService, public securityService: SecurityService,
    public msgBoxServ: MessageboxService, public nepaliCalendarService: NepaliCalendarService,
    public router: Router) {

  }

  public getnamebyCode(code) {//mumbai-team-june2021-danphe-accounting-cache-change
    try {
      var codeList = this.accCacheData.CodeDetails.filter(a => a.Code == code);//mumbai-team-june2021-danphe-accounting-cache-change
      if (codeList.length > 0) {
        let name = codeList.find(a => a.Code == code).Name;
        let type = codeList.find(a => a.Code == code).Description;
        let result = '';
        if (type == "PrimaryGroup") {
          let value = this.accCacheData.PrimaryGroup.find(p => p.PrimaryGroupCode == name);
          if (value) {
            result = value.PrimaryGroupName;
          }
        }
        else if (type == "COA") {
          let value = this.accCacheData.COA.find(c => c.COACode == name);
          if (value) {
            result = value.ChartOfAccountName;
          }
        }
        else if (type == "LedgerGroup") {
          let value = this.accCacheData.LedgerGroups.find(l => l.Name == name);
          if (value) {
            result = value.LedgerGroupName;
          }
        }
        else if (type == "LedgerName") {
          let value = this.accCacheData.Ledgers.find(l => l.Name == name);
          if (value) {
            result = value.LedgerGroupName;
          }
        }
        return result;
      } else {
        return "";
      }

    }
    catch (Exception) {
      throw Exception;
    }

    // return (codeList.length > 0) ? codeList.find(a => a.Code == code).Name : "";//mumbai-team-june2021-danphe-accounting-cache-change
  }

  //mumbai-team-june2021-danphe-accounting-cache-change
  public clearAccCacheDataFromDanpheCache() {
    DanpheCache.clearDanpheCacheByType(MasterType.Ledgers);
    DanpheCache.clearDanpheCacheByType(MasterType.VoucherHead);
    DanpheCache.clearDanpheCacheByType(MasterType.VoucherType);
    DanpheCache.clearDanpheCacheByType(MasterType.LedgerGroups);
    DanpheCache.clearDanpheCacheByType(MasterType.CodeDetails);
    DanpheCache.clearDanpheCacheByType(MasterType.PrimaryGroup);
    DanpheCache.clearDanpheCacheByType(MasterType.COA);
    DanpheCache.clearDanpheCacheByType(MasterType.LedgersAll);
    DanpheCache.clearDanpheCacheByType(MasterType.SubLedgerAll);
    DanpheCache.clearDanpheCacheByType(MasterType.CostCenters);
    DanpheCache.clearDanpheCacheByType(MasterType.Hospitals);
  }

  //mumbai-team-june2021-danphe-accounting-cache-change
  public async getAccCacheData() {
    this.accCacheData = new AccCacheDataVM();
    this.accCacheData.FiscalYearList = this.securityService.AccHospitalInfo.FiscalYearList;
    this.accCacheData.Sections = this.securityService.AccHospitalInfo.SectionList;
    this.accCacheData.Ledgers = await DanpheCache.GetAccCacheData(MasterType.Ledgers, null);
    this.accCacheData.VoucherHead = await DanpheCache.GetAccCacheData(MasterType.VoucherHead, null);
    this.accCacheData.VoucherType = await DanpheCache.GetAccCacheData(MasterType.VoucherType, null);
    this.accCacheData.LedgerGroups = await DanpheCache.GetAccCacheData(MasterType.LedgerGroups, null);
    this.accCacheData.CodeDetails = await DanpheCache.GetAccCacheData(MasterType.CodeDetails, null);
    this.accCacheData.PrimaryGroup = await DanpheCache.GetAccCacheData(MasterType.PrimaryGroup, null);
    this.accCacheData.COA = await DanpheCache.GetAccCacheData(MasterType.COA, null);
    this.accCacheData.LedgersALL = await DanpheCache.GetAccCacheData(MasterType.LedgersAll, null);
    this.accCacheData.SubLedgerAll = await DanpheCache.GetAccCacheData(MasterType.SubLedgerAll, null);
    this.accCacheData.CostCenters = await DanpheCache.GetAccCacheData(MasterType.CostCenters, null);
    this.accCacheData.Hospitals = await DanpheCache.GetAccCacheData(MasterType.Hospitals, null);
    return this.accCacheData;
  }

  public async RefreshAccCacheData() {
    this.clearAccCacheDataFromDanpheCache();
    await this.getAccCacheData();
  }

  public getCoreparameterValue() {
    var paramValue = this.coreService.Parameters.find(a => a.ParameterGroupName == "Common" && a.ParameterName == "CustomerHeader").ParameterValue;
    if (paramValue) {
      this.headerDetail = JSON.parse(paramValue);
    }
    else {
      this.msgBoxServ.showMessage("error", ["Error getting parameters"]);
    }
    var printSettingParameter = JSON.parse(this.coreService.Parameters.find(p => p.ParameterGroupName == "AccReport" && p.ParameterName == "AccReportPrintSetting").ParameterValue);
    this.exportToExcelSettingParameter = JSON.parse(this.coreService.Parameters.find(p => p.ParameterGroupName == "AccReport" && p.ParameterName == "AccExportToExcelSetting").ParameterValue);

    if (!!printSettingParameter || !!this.exportToExcelSettingParameter) {
      this.paramData = null;
      this.paramExportToExcelData = null;
      switch (this.router.url) {
        case ENUM_ACC_ReportName.LedgerReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.LedgerReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.LedgerReport];
          break;
        }
        case ENUM_ACC_ReportName.TrailBalanceReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.TrailBalanceReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.TrailBalanceReport];
          break;
        }
        case ENUM_ACC_ReportName.ProfitLossReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.ProfitLossReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.ProfitLossReport];
          break;
        }
        case ENUM_ACC_ReportName.BalanceSheetReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.BalanceSheetReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.BalanceSheetReport];
          break;
        }
        case ENUM_ACC_ReportName.CashFlowReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.CashFlowReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.CashFlowReport];
          break;
        }
        case ENUM_ACC_ReportName.GroupStatementReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.GroupStatementReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.GroupStatementReport];
          break;
        }
        case ENUM_ACC_ReportName.BankReconciliation: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.BankReconciliation];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.BankReconciliation];
          break;
        }
        case ENUM_ACC_ReportName.CashBankBookReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.CashBankBookReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.CashBankBookReport];
          break;
        }
        case ENUM_ACC_ReportName.DayBookReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.DayBookReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.DayBookReport];
          break;
        }
        case ENUM_ACC_ReportName.SubLedgerReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.SubLedgerReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.SubLedgerReport];
          break;
        }
        case ENUM_ACC_ReportName.AccountHeadDetailReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.AccountHeadDetailReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.AccountHeadDetailReport];
          break;
        }
        case ENUM_ACC_ReportName.InvoiceWiseAgeingReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.InvoiceWiseAgeingReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.InvoiceWiseAgeingReport];
          break;
        }
        case ENUM_ACC_ReportName.TransactionWiseAgeingReport: {
          if (!!printSettingParameter) this.paramData = printSettingParameter[ENUM_ACC_ReportStaticName.TransactionWiseAgeingReport];
          if (this.exportToExcelSettingParameter)
            this.paramExportToExcelData = this.exportToExcelSettingParameter[ENUM_ACC_ReportStaticName.TransactionWiseAgeingReport];
          break;
        }
      }

    }
  }
  public ExportToExcel(tableId, dateRange = "") {
    try {
      let Footer = JSON.parse(JSON.stringify(this.footerContent));
      let date = JSON.parse(JSON.stringify(dateRange));
      date = date.replace("To", " To:");
      this.printBy = this.securityService.loggedInUser.Employee.FullName;
      let printBy = JSON.parse(JSON.stringify(this.printBy));
      let printByMessage = '';
      var hospitalName;
      var address;
      let filename;
      let workSheetName;
      filename = workSheetName = this.paramExportToExcelData.HeaderTitle + moment().format(ENUM_DateTimeFormat.Year_Month_Day_Hour_Minute);
      if (!!this.paramExportToExcelData) {
        if (!!this.paramExportToExcelData.HeaderTitle) {
          if (!this.paramExportToExcelData.HeaderTitle) {
            this.paramExportToExcelData.HeaderTitle = "";
          }
          else {
            var headerTitle = this.paramExportToExcelData.HeaderTitle;
          }
          if (this.paramExportToExcelData.ShowPrintBy) {
            if (!printBy.includes("PrintBy")) {
              printByMessage = 'Exported By:'
            }
            else {
              printByMessage = ''
            }
          }
          else {
            printBy = '';
          }

          date = !this.paramExportToExcelData.ShowDateRange ? "" : date;
          //check Header
          if (this.paramExportToExcelData.ShowHeader == true) {
            hospitalName = this.headerDetail.hospitalName;
            address = this.headerDetail.address;
          }
          else {
            hospitalName = null;
            address = null;
          }
          //check Footer
          if (!this.paramExportToExcelData.ShowFooter) {
            Footer = null;
          }
        }
      }
      else {
        Footer = "";
        printBy = "";
        date = "";
        printByMessage = "";

      }
      CommonFunctions.ConvertHTMLTableToExcelForAccounting(tableId, workSheetName, date,
        headerTitle, filename, hospitalName, address, printByMessage, this.paramExportToExcelData.ShowPrintBy, this.paramExportToExcelData.ShowHeader,
        this.paramExportToExcelData.ShowDateRange, printBy, this.paramExportToExcelData.ShowFooter, Footer)

    } catch (ex) {
      console.log(ex);
    }
  }

  Print(table, dateRange = "") {
    let date = JSON.parse(JSON.stringify(dateRange));
    var printDate = moment().format("YYYY-MM-DD HH:mm");//Take Current Date/Time for PrintedOn Value.
    this.printBy = this.securityService.loggedInUser.Employee.FullName;
    let printBy = JSON.parse(JSON.stringify(this.printBy));
    let popupWinindow;
    if (this.paramData) {
      if (!this.printBy.includes("Printed")) {
        var currDate = moment().format("YYYY-MM-DD HH:mm");
        var nepCurrDate = NepaliCalendarService.ConvertEngToNepaliFormatted_static(currDate, "YYYY-MM-DD hh:mm");
        let printedBy = (this.paramData.ShowPrintBy) ? "<b>Printed By:</b>&nbsp;" + this.printBy : '';
        this.printBy = printedBy;
      }
      this.dateRange = (this.paramData.ShowDateRange) ? date : date = '';
      //this.printBy = "";
    }
    let HeaderElement = document.getElementById("headerForPrint");
    var Header = "";
    if (HeaderElement) {
      Header = HeaderElement.innerHTML;
    }

    // if (table) {
    //       //gets tables wrapped by a div.
    //       var _div = document.getElementById(table).getElementsByTagName("table");
    //       var colCount = [];

    //       //pushes the number of columns of multiple table into colCount array.
    //       for (let i = 0; i < _div.length; i++) {
    //         var col = _div[i].rows[1].cells.length;
    //         colCount.push(col);
    //       }

    //       //get the maximum element from the colCount array.
    //       var maxCol = colCount.reduce(function (a, b) {
    //         return Math.max(a, b);
    //       }, 0);
    //define colspan for td.
    //var span = "colspan= " + Math.trunc(maxCol / 3);
    var printContents = `<div>
                                  <p class='alignleft'>${this.reportHeader}</p>
                                  <p class='alignleft'>${this.dateRange}</p>
                                  <p class='alignright'>
                                    ${this.printBy}<br /> 
                                    <b>Printed On:</b> (AD)${printDate}<br /> 
                                  </p>
                                </div>`
    printContents += "<style> table { border-collapse: collapse; border-color: black;font-size: 11px; } th { color:black; background-color: #599be0;}.ADBS_btn {display:none;padding:0px;}"
    printContents += ".alignleft {float:left;width:33.33333%;text-align:left;}.aligncenter {float: left;width:33.33333%;text-align:center;}.no-print{display:none}.alignright {float: left;width:33.33333%;text-align:right;}​</style>";

    printContents += document.getElementById(table).innerHTML
    popupWinindow = window.open(
      "",
      "_blank",
      "width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,danphe-date-change=no "
    );
    popupWinindow.document.open();
    let documentContent = "<html><head>";
    documentContent +=
      '<link rel="stylesheet" type="text/css" href="../../../assets/global/plugins/bootstrap/css/bootstrap.min.css"/>';
    documentContent +=
      '<link rel="stylesheet" type="text/css" href="../../../themes/theme-default//DanpheStyle.css"/>';
    documentContent += "</head>";
    if (this.paramData) {
      this.printTitle = this.paramData.HeaderTitle;
      this.headerContent = Header;
      printContents = (this.paramData.ShowHeader) ? this.headerContent + printContents : printContents;
      printContents = (this.paramData.ShowFooter) ? printContents + this.footerContent : printContents;
    }
    documentContent +=
      '<body onload="window.print()">' + printContents + "</body></html>";
    popupWinindow.document.write(documentContent);
    popupWinindow.document.close();
    //}
  }
  public SetAllLedgerGroup(allLedgerGroup: ledgerGroupModel[]) {
    this.AllLedgerGroup = allLedgerGroup;
  }
  public SetAllLedgers(allLedger: LedgerModel[]) {
    this.AllLedgers = allLedger;
  }
  public SetAllSubLedgers(allsubLedger: SubLedgerModel[]) {
    this.AllSubLedger = allsubLedger;
  }
  public SetAllCodeDetails(allCodeDetails: CodeDetailsModel[]) {
    this.AllCodeDetails = allCodeDetails;
  }

  public SetAllSections(sections: SectionModel[]) {
    this.AllSections = sections;
  }

  public SetCacheLedgerList(ledgers: Array<LedgerModel>) {
    ledgers.forEach(led => {
      let index = this.accCacheData.LedgersALL.findIndex(a => a.LedgerId === led.LedgerId);
      if (index < 0) {
        this.accCacheData.LedgersALL.push(led);
      }
    })
  }
}
