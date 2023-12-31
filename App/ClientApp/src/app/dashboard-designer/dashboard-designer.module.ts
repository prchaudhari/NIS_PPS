import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/modules/shared.module';
import { DashboardDesignerRoutingModule } from './dashboard-designer-routing.module';
import { AddDashboardDesignerComponent } from './add-dashboard-designer/add-dashboard-designer.component';
import { ViewDashboardDesignerComponent } from './view-dashboard-designer/view-dashboard-designer.component';
import { GridsterModule } from 'angular-gridster2';
import { LayoutModule } from '../layout/layout.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DynamicModule } from 'ng-dynamic-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CustomerInformationComponent, AccountInformationComponent, ImageComponent, VideoComponent, SummaryAtGlanceComponent,
  TransactionDetailsComponent, SavingAvailableBalanceComponent, CurrentAvailableBalanceComponent, SavingTransactionDetailsComponent, SpendindTrendsComponent,
  TopIncomeSourcesComponent, SavingTrendsComponent, AnalyticsWidgetComponent, ReminderAndRecommComponent, SavingTrendsPreviewComponent, AnalyticsWidgetPreviewComponent, 
  SpendindTrendsPreviewComponent, DynamicLineChartWidgetComponent, DynamicBarChartWidgetComponent, DynamicPieChartWidgetComponent, DynamicHhtmlComponent, StaticHtmlComponent, PageBreakComponent, SegmentBasedContentComponent,
  DynamicBarChartWidgetPreviewComponent, DynamicLineChartWidgetPreviewComponent, DynamicPieChartWidgetPreviewComponent,
  CustomerDetailsComponent, BankDetailsComponent, WealthBankDetailsComponent, InvestmentPortfolioStatementComponent, InvestmentWealthPortfolioStatementComponent, InvestorPerformanceComponent, WealthInvestorPerformanceComponent, BreakdownOfInvestmentAccountsComponent, ExplanatoryNotesComponent, WealthExplanatoryNotesComponent, NedbankServiceComponent, WealthNedbankServiceComponent, PersonalLoanDetailComponent, PersonalLoanTransactionComponent, PersonalLoanPaymentDueComponent, SpecialMessageComponent, PersonalLoanInsuranceMessageComponent,
  PersonalLoanTotalAmountDetailComponent, PersonalLoanAccountsBreakdownComponent, HomeLoanTotalAmountDetailComponent, HomeLoanAccountsBreakdownComponent, HomeLoanPaymentDueSpecialMsgComponent,
  HomeLoanInstalmentDetailComponent, PortfolioCustomerDetailsComponent, PortfolioCustomerAddressDetailsComponent, PortfolioClientContactDetailsComponent, PortfolioAccountSummaryDetailsComponent,
  PortfolioAccountAnalysisComponent,CorporateSaverAgentAddressComponent, PortfolioRemindersComponent, PortfolioNewsAlertsComponent, GreenbacksContactUsComponent, YTDRewardPointsComponent, PointsRedeemedYTDComponent, ProductRelatedPointsEarnedComponent, CategorySpendRewardsComponent, PortfolioAccountAnalysisPreviewComponent, YTDRewardPointsPreviewComponent, PointsRedeemedYTDPreviewComponent, ProductRelatedPointsEarnedPreviewComponent, CategorySpendRewardsPreviewComponent, GreenbacksTotalRewardPointsComponent, WealthBreakdownOfInvestmentAccountsComponent, HomeLoanSummaryTaxPurposeComponent, HomeLoanInstalmentComponent, WealthHomeLoanTotalAmountDetailComponent, WealthHomeLoanAccountsBreakdownComponent, WealthHomeLoanSummaryTaxPurposeComponent, WealthHomeLoanInstalmentComponent, WealthHomeLoanBankDetailsComponent, MCAAccountSummaryComponent, MCATransactionComponent, MCAVATAnalysisComponent, WealthMCAVATAnalysisComponent, WealthMCATransactionComponent, WealthMCAAccountSummaryComponent, WealthMCABranchDetailsComponent, CSAgentLogoComponent, CorporateSaverAgentMessageComponent,CorporateSaverTransactionComponent,CorporateSaverClientDetailsComponent,CorporateSaverTableTotalComponent,CorporateAgentDetailsComponent} from './widgetComponent/widgetComponent';
import { PageDesignPreviewComponent } from './page-design-preview/page-design-preview.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SafeHtmlPip } from '../shared/pagepreview/pagepreview.component';

@NgModule({
  declarations: [AddDashboardDesignerComponent, ViewDashboardDesignerComponent, CustomerInformationComponent,
    AccountInformationComponent, ImageComponent, VideoComponent, SummaryAtGlanceComponent, TransactionDetailsComponent,
    SavingAvailableBalanceComponent, CurrentAvailableBalanceComponent, SavingTransactionDetailsComponent,
    SpendindTrendsComponent, TopIncomeSourcesComponent, SavingTrendsComponent, AnalyticsWidgetComponent, ReminderAndRecommComponent, SavingTrendsPreviewComponent, AnalyticsWidgetPreviewComponent, 
    SpendindTrendsPreviewComponent, DynamicBarChartWidgetComponent, DynamicLineChartWidgetComponent, DynamicPieChartWidgetComponent, DynamicHhtmlComponent, StaticHtmlComponent, PageBreakComponent, SegmentBasedContentComponent,
    DynamicBarChartWidgetPreviewComponent, DynamicLineChartWidgetPreviewComponent, DynamicPieChartWidgetPreviewComponent,
    CustomerDetailsComponent,CorporateSaverAgentAddressComponent, BankDetailsComponent, WealthBankDetailsComponent, InvestmentPortfolioStatementComponent, InvestmentWealthPortfolioStatementComponent, InvestorPerformanceComponent, WealthInvestorPerformanceComponent, BreakdownOfInvestmentAccountsComponent, WealthBreakdownOfInvestmentAccountsComponent, ExplanatoryNotesComponent, WealthExplanatoryNotesComponent, NedbankServiceComponent, WealthNedbankServiceComponent, PersonalLoanDetailComponent, PersonalLoanTransactionComponent, PersonalLoanPaymentDueComponent, SpecialMessageComponent, PersonalLoanInsuranceMessageComponent, HomeLoanSummaryTaxPurposeComponent, HomeLoanInstalmentComponent,
    PersonalLoanTotalAmountDetailComponent, PersonalLoanAccountsBreakdownComponent, HomeLoanTotalAmountDetailComponent, HomeLoanAccountsBreakdownComponent,
    HomeLoanPaymentDueSpecialMsgComponent, HomeLoanInstalmentDetailComponent, PortfolioCustomerDetailsComponent, PortfolioCustomerAddressDetailsComponent, PortfolioClientContactDetailsComponent, PortfolioAccountSummaryDetailsComponent, PortfolioAccountAnalysisComponent, PortfolioRemindersComponent, PortfolioNewsAlertsComponent, GreenbacksContactUsComponent, YTDRewardPointsComponent, PointsRedeemedYTDComponent, ProductRelatedPointsEarnedComponent, CategorySpendRewardsComponent, PortfolioAccountAnalysisPreviewComponent, YTDRewardPointsPreviewComponent, PointsRedeemedYTDPreviewComponent, ProductRelatedPointsEarnedPreviewComponent, CategorySpendRewardsPreviewComponent, GreenbacksTotalRewardPointsComponent, WealthHomeLoanTotalAmountDetailComponent, WealthHomeLoanAccountsBreakdownComponent, WealthHomeLoanSummaryTaxPurposeComponent, WealthHomeLoanInstalmentComponent, WealthHomeLoanBankDetailsComponent, MCAAccountSummaryComponent, MCATransactionComponent, MCAVATAnalysisComponent, WealthMCAVATAnalysisComponent, WealthMCATransactionComponent, WealthMCAAccountSummaryComponent, WealthMCABranchDetailsComponent,
    PageDesignPreviewComponent, CSAgentLogoComponent, CorporateSaverAgentMessageComponent, CorporateSaverTransactionComponent,CorporateSaverClientDetailsComponent,CorporateAgentDetailsComponent,CorporateSaverTableTotalComponent],
  imports: [
    CommonModule, DashboardDesignerRoutingModule, RouterModule, SharedModule, FormsModule, ReactiveFormsModule,
    GridsterModule, LayoutModule, MatSortModule, MatTableModule, MatPaginatorModule, DynamicModule, RichTextEditorAllModule
  ],
  entryComponents: [
    CustomerInformationComponent, AccountInformationComponent, ImageComponent, VideoComponent, SummaryAtGlanceComponent, TransactionDetailsComponent, SavingAvailableBalanceComponent,
    CurrentAvailableBalanceComponent, SavingTransactionDetailsComponent, SpendindTrendsComponent, TopIncomeSourcesComponent, SavingTrendsComponent, AnalyticsWidgetComponent,
    ReminderAndRecommComponent, SavingTrendsPreviewComponent, AnalyticsWidgetPreviewComponent, SpendindTrendsPreviewComponent,
    DynamicLineChartWidgetComponent, DynamicBarChartWidgetComponent, DynamicPieChartWidgetComponent, DynamicHhtmlComponent, StaticHtmlComponent, PageBreakComponent, SegmentBasedContentComponent,
    DynamicBarChartWidgetPreviewComponent, DynamicLineChartWidgetPreviewComponent, DynamicPieChartWidgetPreviewComponent,
    CustomerDetailsComponent,CorporateSaverAgentAddressComponent, BankDetailsComponent, WealthBankDetailsComponent, InvestmentPortfolioStatementComponent, InvestmentWealthPortfolioStatementComponent, InvestorPerformanceComponent, WealthInvestorPerformanceComponent, BreakdownOfInvestmentAccountsComponent, WealthBreakdownOfInvestmentAccountsComponent, ExplanatoryNotesComponent, WealthExplanatoryNotesComponent, NedbankServiceComponent, WealthNedbankServiceComponent, PersonalLoanDetailComponent, PersonalLoanTransactionComponent, PersonalLoanPaymentDueComponent, SpecialMessageComponent, PersonalLoanInsuranceMessageComponent, HomeLoanSummaryTaxPurposeComponent, HomeLoanInstalmentComponent,
    PersonalLoanTotalAmountDetailComponent, PersonalLoanAccountsBreakdownComponent, HomeLoanTotalAmountDetailComponent, HomeLoanAccountsBreakdownComponent,
    HomeLoanPaymentDueSpecialMsgComponent, HomeLoanInstalmentDetailComponent, PortfolioCustomerDetailsComponent, PortfolioCustomerAddressDetailsComponent, PortfolioClientContactDetailsComponent, PortfolioAccountSummaryDetailsComponent, PortfolioAccountAnalysisComponent, PortfolioRemindersComponent, PortfolioNewsAlertsComponent, GreenbacksContactUsComponent, YTDRewardPointsComponent, PointsRedeemedYTDComponent, ProductRelatedPointsEarnedComponent, CategorySpendRewardsComponent, PortfolioAccountAnalysisPreviewComponent, YTDRewardPointsPreviewComponent, PointsRedeemedYTDPreviewComponent, ProductRelatedPointsEarnedPreviewComponent, CategorySpendRewardsPreviewComponent, GreenbacksTotalRewardPointsComponent,
    WealthHomeLoanTotalAmountDetailComponent, WealthHomeLoanAccountsBreakdownComponent, WealthHomeLoanSummaryTaxPurposeComponent, WealthHomeLoanInstalmentComponent, WealthHomeLoanBankDetailsComponent, MCAAccountSummaryComponent, MCATransactionComponent, MCAVATAnalysisComponent, WealthMCAVATAnalysisComponent, WealthMCATransactionComponent, WealthMCAAccountSummaryComponent, WealthMCABranchDetailsComponent,
    PageDesignPreviewComponent, CSAgentLogoComponent, CorporateSaverAgentMessageComponent, CorporateSaverTransactionComponent,CorporateSaverClientDetailsComponent,CorporateSaverTableTotalComponent,CorporateAgentDetailsComponent],
})
export class DashboardDesignerModule { }
