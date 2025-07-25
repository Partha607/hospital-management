import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { PharmacyDashboardComponent } from "../dashboards/pharmacy/pharmacy-dashboard.component";
import { AuthGuardService } from '../security/shared/auth-guard.service';
import { PHRMSuppliersListComponent } from './accounting/phrm-acc-supplier-list.component';
import { PHRMAccountingMainComponent } from './accounting/phrm-accounting-main.component';
import { PHRMBillingMainComponent } from "./billing/phrm-billing-main.component";
import { PHRMGoodsReceiptListComponent } from "./order/phrm-gr-list/phrm-goods-receipt-list.component";
import { PHRMOrderMainComponent } from "./order/phrm-order-main.component";
import { PHRMPurchaseOrderListComponent } from "./order/phrm-po-list/phrm-purchase-order-list.component";
import { PharmacyMainComponent } from "./pharmacy-main.component";
import { PHRMProvisionalItems } from "./provisional-items/phrm-provisional-items.component";
import { PhrmRackComponent } from './rack/phrm-rack.component';
import { PHRMABCVEDReportComponent } from './report/abc-ved/phrm-abcved-report.component';
import { PHRMBatchStockReportComponent } from './report/batch-stock/phrm-batch-stock-report.component';
import { PHRMBillingReportComponent } from './report/billing/phrm-billing-report.component';
import { PHRMBreakageItemReportComponent } from "./report/breakage-items/phrm-breakage-item-report.component";
import { PHRMCashCollectionSummaryReportComponent } from './report/cash-collection/phrm-cashcollection-summary-report.component ';
import { PHRMCounterwiseCollectionReportComponent } from './report/counter-collection/phrm-counterwise-collection-report.component';
import { PHRMCreditInOutPatientReportComponent } from './report/credit-inout-patient/phrm-credit-in-out-patient-report.component';
import { PHRMDailySalesSummaryComponent } from './report/daily-sales/phrm-daily-sales-summary.component';
import { PHRMDailyStockSummaryReportComponent } from './report/daily-stock/phrm-daily-stock-summary-report.component';
import { PHRMDepositBalanceReport } from './report/deposit/phrm-deposit-balance-report.component';
import { PHRMDrugCategoryWiseReportComponent } from "./report/drug-category/phrm-drug-categorywise-report.component";
import { PHRMEndingStockSummaryReportComponent } from './report/ending-stock/phrm-ending-stock-summary-report.component';
import { PHRMExpiryReportComponent } from './report/expiry-stock/phrm-expiry-report.component';
import { PHRMGoodsReceiptProductReportComponent } from "./report/gr-products/phrm-good-receipt-product-report.component";
import { PHRMItemWiseStockReportComponent } from "./report/itemwise-stock/phrm-itemwise-stock-report.component";
import { PHRMMinStockComponent } from './report/min-stock/phrm-minstock-report.component';
import { PHRMNarcoticsDailySalesReportComponent } from './report/narcotics/phrm-narcotics-daily-sales-report.component ';
import { PHRMNarcoticsStockReportComponent } from './report/narcotics/phrm-narcotics-stock-report.component';
import { PHRMReportMainComponent } from "./report/phrm-report-main.component";
import { PHRMPurchaseOrderReportComponent } from "./report/po/phrm-purchase-order-report.component";
import { PHRMReturnToSupplierReportComponent } from './report/return-to-supplier/phrm-return-to-supplier-report.component';
import { PHRMSaleReturnReportComponent } from './report/sales-return/phrm-sale-return-report.component';
import { PHRMStockItemsReportComponent } from './report/stock-items/phrm-stock-items-report.component';
import { PHRMStockManageReportComponent } from "./report/stock-manage/phrm-stock-manage-report.component";
import { PHRMStockMovementReportComponent } from './report/stock-movement/phrm-stock-movement-report.component';
import { PHRMSupplierInformationReportComponent } from './report/supplier-info/phrm-supplier-information-report.component';
import { PHRMSupplierStockReportComponent } from './report/supplier-stock/phrm-supplier-stock-report.component';
import { PHRMSupplierStockSummaryReportComponent } from './report/supplier-stock/phrm-supplier-stock-summary-report.component';
import { PHRMTransferToDispensaryReportComponent } from './report/transfer-dispensary/phrm-transfer-to-dispensary-report.component';
import { PHRMTransferToStoreReportComponent } from './report/transfer-store/phrm-transfer-to-store-report.component';
import { PHRMUserwiseCollectionReportComponent } from './report/user-collection/phrm-userwise-collection-report.component';
import { PHRMCategoryManageComponent } from "./setting/category/phrm-category-manage.component";
import { PHRMCompanyManageComponent } from "./setting/company/phrm-company-manage.component";
import { PHRMDispensaryManageComponent } from "./setting/dispensary/phrm-dispensary-manage.component";
import { PHRMGenericManageComponent } from "./setting/generic/phrm-generic-manage.component";
import { PHRMItemTypeManageComponent } from "./setting/item-type/phrm-item-type-manage.component";
import { PHRMItemMasterManageComponent } from "./setting/item/phrm-item-manage.component";
import { PHRMSettingMainComponent } from "./setting/phrm-setting-main.component";
import { PHRMSupplierManageComponent } from "./setting/supplier/phrm-supplier-manage.component";
import { PHRMTAXManageComponent } from "./setting/tax/phrm-tax-manage.component";
import { PHRMUnitOfMeasurementManageComponent } from "./setting/uom/phrm-uom-manage.component";
import { PHRMStoreMainComponent } from './store/phrm-store-main.component';
import { PHRMReturnItemToSupplierListComponent } from "./store/return-to-supplier/phrm-return-item-to-supplier-list.component";
import { PHRMReturnItemsToSupplierComponent } from "./store/return-to-supplier/phrm-return-items-to-supplier.component";
import { PHRMSalesDetailsListComponent } from './store/sales-category/phrm-sales-category-list.component';
import { PHRMStoreDetailsListComponent } from './store/store-details/phrm-store-details-list.component';
import { PHRMStoreDispatchDetailsComponent } from './substore-requisition-dispatch/dispensary-dispatch/phrm-store-dispatch-details.components';
import { PHRMStoreDispatchItemsComponent } from './substore-requisition-dispatch/dispensary-dispatch/phrm-store-dispatch-items.component';
import { WardRequisitionItems } from './ward-requisition/phrm-ward-requisition.component';

import { PageNotFound } from '../404-error/404-not-found.component';
import { TermsListComponent } from '../inventory/settings/termsconditions/terms-list.component';
import { InvoiceHeaderListComponent } from '../shared/invoice-header/invoice-header-list.component';
import { PHRMGoodsReceiptComponent } from './order/phrm-gr/phrm-goods-receipt.component';
import { PhrmRackAllocationComponent } from './rack/phrm-rack-allocation/phrm-rack-allocation.component';
import { PhrmRackMainComponent } from './rack/phrm-rack-main/phrm-rack-main.component';
import { RankMembershipwiseSalesReportComponent } from './report/RankMembershipwiseSalesReport/RankMembershipwiseSalesReport.component';
import { PHRMBillSummaryReportDetailComponent } from './report/bills-summary/phrm-bills-summary-report-detail.component';
import { PHRMBillSummaryReportComponent } from './report/bills-summary/phrm-bills-summary-report.component';
import { DatewisePurchaseReportComponent } from './report/datewise-purchase-report/datewise-purchase-report.component';
import { DoctorWisePrescriptionSalesReportComponent } from './report/doctorwise-sales-report/doctorwise-prescription-sales-report.component';
import { ItemWisePurchaseReportComponent } from './report/item-wise-purchase-report/item-wise-purchase-report.component';
import { ItemWiseWardSupplyReportComponent } from './report/item-wise-wardsupply-report/item-wise-wardsupply-report.component';
import { NarcoticStockLedgerComponent } from './report/narcotics/phrm-narcotics-stock-ledger.component';
import { PHRMPaymentModeWiseReportComponent } from './report/payment-mode-wise-report/phrm-paymentmodewise-report.component';
import { PHRMPurchaseReportComponent } from './report/phrm-purchase-report/phrm-purchase-report.component';
import { PHRMPurchaseSummaryComponent } from './report/phrm-purchase-report/purchase-summary/phrm-purchase-summary.component';
import { PhrmInsBimaReportComponent } from './report/phrm-sales-report/ins-bima-report/phrm-ins-bima-report.component';
import { PHRMPatientSalesDetailComponent } from './report/phrm-sales-report/patient-sales-detail/phrm-patient-sales-detail.component';
import { PHRMSalesReportComponent } from './report/phrm-sales-report/phrm-sales-report.component';
import { PHRMSalesStatementComponent } from './report/phrm-sales-report/sales-statement/phrm-sales-statement.component';
import { PHRMSalesSummaryComponent } from './report/phrm-sales-report/sales-summary/phrm-sales-summary.component';
import { PHRMStockReportComponent } from './report/phrm-stock-report/phrm-stock-report.component';
import { PHRMStockTransferSummaryReportComponent } from './report/phrm-stock-report/phrm-stock-transfer-summary-report/phrm-stock-transfer-summary-report.component';
import { PHRMStockSummarySecondComponent } from './report/phrm-stock-report/stock-summary-second/phrm-stock-summary-second.component';
import { StockTransfersReportComponent } from './report/phrm-stock-report/stock-transfers-report/stock-transfers-report.component';
import { PHRMSupplierReportComponent } from './report/phrm-supplier-report/phrm-supplier-report.component';
import { SupplierWiseStockReportComponent } from './report/phrm-supplier-report/supplierwise-stock-report/supplierwise-stock-report.component';
import { ProvisionalSalesReportComponent } from './report/provisional-sales-report/provisional-sales-report.component';
import { PHRMRackStockDistributionReportComponent } from './report/rack-stock/phrm-rack-stock-distribution-report.component';
import { ReturnFromCustomerComponent } from './report/return-from-customer/return-from-customer.component';
import { ReturnOnInvestmentReportComponent } from './report/return-on-investment-report/return-on-investment-report.component';
import { PHRMSettlementSummaryReportComponent } from './report/settlement-summary-report/phrm-settlement-summary-report.component';
import { StockLedgerReportComponent } from './report/stock-ledger-report/stock-ledger-report.component';
import { PHRMStockSummaryReportComponent } from './report/stock-summary/phrm-stock-summary-report.component';
import { SupplierWisePurchaseReportComponent } from './report/supplierwise-purchase-report/supplierwise-purchase-report.component';
import { CreditOrganizationListComponent } from './setting/credit-organization/phrm-credit-organizations-list.component';
import { PHRMPackageManageListComponent } from './setting/medicine-package/phrm-package-manage-list.component';
import { PHRMPackingTypeListComponent } from './setting/packing-type/phrm-packing-type-list.component';
import { PHRMReturnToSupplierNewComponent } from './store/return-to-supplier-new/return-to-supplier-new.component';
import { WriteOffItemComponent } from './store/write-off/write-off-item/write-off-item.component';
import { WriteOffListComponent } from './store/write-off/write-off-list/write-off-list.component';
import { DirectDispatchComponent } from './substore-requisition-dispatch/direct-dispatch/direct-dispatch.component';
import { PHRMStoreRequisitionDetailsComponent } from './substore-requisition-dispatch/dispensary-request/phrm-store-requisition-details.component';
import { PHRMStoreRequisitionListComponent } from './substore-requisition-dispatch/dispensary-request/phrm-store-requisition-list.component';
import { SubstoreRequisitionDispatchMainComponent } from './substore-requisition-dispatch/substore-requisition-dispatch-main.component';
import { SupplierLedgerViewComponent } from './supplier-ledger/supplier-ledger-view/supplier-ledger-view.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PharmacyMainComponent, canActivate: [AuthGuardService],

        children: [
          { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
          { path: 'Dashboard', component: PharmacyDashboardComponent, canActivate: [AuthGuardService] },
          { path: 'Billing', component: PHRMBillingMainComponent, canActivate: [AuthGuardService] },
          {
            path: 'Order',
            component: PHRMOrderMainComponent,
            children: [
              { path: '', redirectTo: 'GoodsReceiptList', pathMatch: 'full' },
              //{ path: 'PurchaseOrderItems', component: PHRMPurchaseOrderComponent },
              { path: 'PurchaseOrder', component: PHRMPurchaseOrderListComponent },
              { path: 'GoodsReceiptItems', component: PHRMGoodsReceiptComponent },
              { path: 'GoodsReceiptList', component: PHRMGoodsReceiptListComponent },
              { path: "**", component: PageNotFound }

            ]
          },
          {
            path: 'Supplier',
            component: PHRMAccountingMainComponent,
            children: [
              { path: '', redirectTo: 'PharmacySuppliersList', pathMatch: 'full' },
              { path: 'PharmacySuppliersList', component: PHRMSuppliersListComponent },
              { path: "**", component: PageNotFound }

            ]
          },
          {
            path: 'Report', component: PHRMReportMainComponent, children: [
              {
                path: 'Purchase', children: [
                  { path: '', component: PHRMPurchaseReportComponent },
                  { path: 'DateWisePurchaseReport', component: DatewisePurchaseReportComponent },
                  { path: 'GoodsReceiptProductReport', component: PHRMGoodsReceiptProductReportComponent },
                  { path: 'ItemWisePurchaseReport', component: ItemWisePurchaseReportComponent },
                  { path: 'PurchaseOrderReport', component: PHRMPurchaseOrderReportComponent },
                  { path: 'ReturnToSupplierReport', component: PHRMReturnToSupplierReportComponent },
                  { path: 'PurchaseSummary', component: PHRMPurchaseSummaryComponent },
                  { path: 'SupplierWisePurchaseReport', component: SupplierWisePurchaseReportComponent, }
                ]
              },
              {
                path: 'Sales', children: [
                  { path: '', component: PHRMSalesReportComponent },
                  { path: 'BillingReport', component: PHRMBillingReportComponent },
                  { path: 'CounterwiseCollectionReport', component: PHRMCounterwiseCollectionReportComponent },
                  { path: 'CashCollectionSummaryReport', component: PHRMCashCollectionSummaryReportComponent },
                  { path: 'DepositBalanceReport', component: PHRMDepositBalanceReport },
                  { path: 'DrugCategoryWiseReport', component: PHRMDrugCategoryWiseReportComponent },
                  { path: 'LedgerCreditInOutPatientReport', component: PHRMCreditInOutPatientReportComponent },
                  { path: 'PHRMDailySalesSummary', component: PHRMDailySalesSummaryComponent },
                  { path: 'PHRMNarcoticsDailySalesReport', component: PHRMNarcoticsDailySalesReportComponent },
                  { path: 'SaleReturnReport', component: PHRMSaleReturnReportComponent },
                  { path: 'UserwiseCollectionReport', component: PHRMUserwiseCollectionReportComponent },
                  { path: 'SalesStatement', component: PHRMSalesStatementComponent },
                  { path: 'INSPatientBima', component: PhrmInsBimaReportComponent },
                  { path: 'SalesSummary', component: PHRMSalesSummaryComponent },
                  { path: 'PatientWiseSalesDetail', component: PHRMPatientSalesDetailComponent },
                  { path: 'SettlementSummaryReport', component: PHRMSettlementSummaryReportComponent },
                  { path: 'ReturnOnInvestmentReport', component: ReturnOnInvestmentReportComponent },
                  { path: 'PHRMPaymentModeWiseReport', component: PHRMPaymentModeWiseReportComponent },
                  { path: 'RankMembershipwiseSalesReport', component: RankMembershipwiseSalesReportComponent },
                  { path: 'DoctorwisePrescribedSalesReport', component: DoctorWisePrescriptionSalesReportComponent },
                  { path: 'BillSummary', component: PHRMBillSummaryReportComponent },
                  { path: 'BillSummaryDetail', component: PHRMBillSummaryReportDetailComponent },
                  { path: 'ProvisionalSales', component: ProvisionalSalesReportComponent }
                ]
              },
              {
                path: 'Stock', children: [
                  { path: '', component: PHRMStockReportComponent },
                  { path: 'ABCVEDStock', component: PHRMABCVEDReportComponent },
                  { path: 'BreakageItemReport', component: PHRMBreakageItemReportComponent },
                  { path: 'BatchStockReport', component: PHRMBatchStockReportComponent },
                  { path: 'DailyStockSummaryReport', component: PHRMDailyStockSummaryReportComponent },
                  { path: 'EndingStockSummary', component: PHRMEndingStockSummaryReportComponent },
                  { path: 'ExpiryReport', component: PHRMExpiryReportComponent },
                  { path: 'ItemWiseStockReport', component: PHRMItemWiseStockReportComponent },
                  { path: 'TransferToStoreReport', component: PHRMTransferToStoreReportComponent },
                  { path: 'TransferToDispensaryReport', component: PHRMTransferToDispensaryReportComponent },
                  { path: 'PHRMMinStock', component: PHRMMinStockComponent },
                  { path: 'PHRMNarcoticsStockReport', component: PHRMNarcoticsStockReportComponent },
                  { path: 'PHRMRackStockDistributionReport', component: PHRMRackStockDistributionReportComponent },
                  { path: 'ReturnFromCustomerReport', component: ReturnFromCustomerComponent },
                  { path: 'StockManageDetailReport', component: PHRMStockManageReportComponent },
                  { path: 'StockSummaryReport', component: PHRMStockSummaryReportComponent },
                  { path: 'StockItemsReport', component: PHRMStockItemsReportComponent },
                  { path: 'SupplierStockSummaryReport', component: PHRMSupplierStockSummaryReportComponent },
                  { path: 'StockMovementReport', component: PHRMStockMovementReportComponent },
                  { path: 'SupplierStockReport', component: PHRMSupplierStockReportComponent },
                  { path: 'StockSummarySecond', component: PHRMStockSummarySecondComponent },
                  { path: 'StockTransfers', component: StockTransfersReportComponent },
                  { path: 'StockLedgerReport', component: StockLedgerReportComponent },
                  { path: 'SupplierWiseStockReport', component: SupplierWiseStockReportComponent },
                  { path: 'ItemWiseWardSupplyReport', component: ItemWiseWardSupplyReportComponent },
                  { path: 'StockTransferSummaryReport', component: PHRMStockTransferSummaryReportComponent },
                  { path: 'NarcoticsLedger', component: NarcoticStockLedgerComponent },
                ]
              },
              {
                path: 'Supplier', children: [
                  { path: '', component: PHRMSupplierReportComponent },
                  { path: 'SupplierInfoReport', component: PHRMSupplierInformationReportComponent },
                ]
              },
              { path: '', redirectTo: 'Stock', pathMatch: 'full' }
            ]
          },
          //{ path: 'Report/StoreStockReport', component: PHRMStoreStockReportComponent },
          {
            path: 'Setting',
            component: PHRMSettingMainComponent,

            children: [
              { path: '', redirectTo: 'ItemManage', pathMatch: 'full' },
              { path: 'SupplierManage', component: PHRMSupplierManageComponent },
              { path: 'CompanyManage', component: PHRMCompanyManageComponent },
              { path: 'CategoryManage', component: PHRMCategoryManageComponent },
              { path: 'UnitOfMeasurementManage', component: PHRMUnitOfMeasurementManageComponent },
              { path: 'ItemTypeManage', component: PHRMItemTypeManageComponent },
              { path: 'ItemManage', component: PHRMItemMasterManageComponent },
              { path: 'TAXManage', component: PHRMTAXManageComponent },
              { path: 'GenericManage', component: PHRMGenericManageComponent },
              {
                path: 'RackSetting', component: PhrmRackMainComponent,
                children: [
                  { path: '', redirectTo: 'Rack', pathMatch: 'full' },
                  { path: 'Rack', component: PhrmRackComponent },
                  { path: 'RackAllocation', component: PhrmRackAllocationComponent }
                ]
              },
              { path: 'Dispensary', component: PHRMDispensaryManageComponent },
              { path: 'CreditOrganizations', component: CreditOrganizationListComponent },
              { path: 'TermsList/:id', component: TermsListComponent },
              { path: 'InvoiceHeaders/:module', component: InvoiceHeaderListComponent },
              { path: 'Packing', component: PHRMPackingTypeListComponent },
              { path: 'ManagePharmacyPackages', component: PHRMPackageManageListComponent },
              { path: "**", component: PageNotFound }
            ]
          },
          { path: 'ProvisionalItems', component: PHRMProvisionalItems },
          { path: 'WardRequisition', component: WardRequisitionItems },

          {
            path: 'Store',
            component: PHRMStoreMainComponent,
            children: [
              { path: '', redirectTo: 'StoreDetails', pathMatch: 'full' },
              { path: 'ReturnItemsToSupplier', component: PHRMReturnItemsToSupplierComponent },
              { path: 'ReturnItemsToSupplierList', component: PHRMReturnItemToSupplierListComponent },
              { path: 'StoreDetails', component: PHRMStoreDetailsListComponent },
              { path: 'SalesCategoryList', component: PHRMSalesDetailsListComponent },
              // { path: 'StoreRequisition', component: PHRMStoreRequisitionListComponent },
              // { path: 'StoreRequisitionDetails', component: PHRMStoreRequisitionDetailsComponent },
              // { path: 'StoreDispatch', component: PHRMStoreDispatchItemsComponent },
              // { path: 'StoreDispatchDetails', component: PHRMStoreDispatchDetailsComponent },
              // { path: 'DirectDispatch', component: DirectDispatchComponent },
              {
                path: 'WriteOffItems', children: [
                  { path: '', redirectTo: 'List', pathMatch: 'full' },
                  { path: 'List', component: WriteOffListComponent },
                  { path: 'Add', component: WriteOffItemComponent },
                ]
              },
              { path: 'ReturnToSupplier', component: PHRMReturnToSupplierNewComponent },
              { path: "**", component: PageNotFound }

            ]
          },
          { path: 'SupplierLedger', component: SupplierLedgerComponent },
          { path: 'SupplierLedgerView', component: SupplierLedgerViewComponent },
          {
            path: 'SubstoreRequestAndDispatch', component: SubstoreRequisitionDispatchMainComponent,
            children: [
              { path: '', redirectTo: 'Requisitions', pathMatch: 'full' },
              { path: 'Requisitions', component: PHRMStoreRequisitionListComponent },
              { path: 'RequisitionDetails', component: PHRMStoreRequisitionDetailsComponent },
              { path: 'Dispatch', component: PHRMStoreDispatchItemsComponent },
              { path: 'DispatchDetails', component: PHRMStoreDispatchDetailsComponent },
              { path: 'DirectDispatch', component: DirectDispatchComponent },
            ]
          },
          { path: "**", component: PageNotFound }


        ]
      },
      { path: "**", component: PageNotFound }
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class PharmacyRoutingModule {

}
