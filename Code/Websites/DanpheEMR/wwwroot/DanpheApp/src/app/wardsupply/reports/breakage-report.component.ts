import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { SecurityService } from '../../security/shared/security.service';
import { MessageboxService } from '../../shared/messagebox/messagebox.service';
import { ENUM_MessageBox_Status } from '../../shared/shared-enums';
import WARDGridColumns from "../shared/ward-grid-cloumns";
import { WARDReportsModel } from '../shared/ward-report.model';
import { WardSupplyBLService } from "../shared/wardsupply.bl.service";


@Component({
  selector: 'my-app',

  templateUrl: "./breakage-report.html"

})
export class WardBreakageReportComponent {
  public CurrentStoreId: number = 0;
  WardBreakageColumn: Array<any> = null;
  WardBreakageData: Array<any> = new Array<WARDReportsModel>();
  public wardReports: WARDReportsModel = new WARDReportsModel();

  constructor(public wardBLService: WardSupplyBLService, public msgBoxServ: MessageboxService,
    public router: Router, public securityService: SecurityService) {
    try {
      this.CurrentStoreId = this.securityService.getActiveStore().StoreId;
      if (!this.CurrentStoreId) {
        this.LoadSubStoreSelectionPage();
      }
      else {
        this.WardBreakageColumn = WARDGridColumns.WardBreakageReport;
        this.wardReports.FromDate = moment().format('YYYY-MM-DD');
        this.wardReports.ToDate = moment().format('YYYY-MM-DD');
        this.wardReports.StoreId = this.CurrentStoreId;
      }
    } catch (exception) {
      this.msgBoxServ.showMessage("Error", [exception]);
    }
  };

  LoadSubStoreSelectionPage() {
    this.router.navigate(['/WardSupply/Pharmacy']);
  }

  //Export data grid options for excel file
  gridExportOptions = {
    fileName: 'WardBreakageReport' + moment().format('YYYY-MM-DD') + '.xls',
  };

  Load() {
    this.wardBLService.GetWardBreakageReport(this.wardReports)
      .subscribe(res => {
        if (res.Status == 'OK' && res.Results.length) {
          this.WardBreakageData = res.Results;
        }
        else {

          this.msgBoxServ.showMessage(ENUM_MessageBox_Status.Notice, [res.ErrorMessage])
        }
      });

  }
}
