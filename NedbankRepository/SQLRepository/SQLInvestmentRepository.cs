﻿namespace NedbankRepository
{

    #region References
    using NedBankException;
    using NedbankModel;
    using NedbankUtility;
    using NedBankValidationEngine;
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Text;
    using Unity;

    #endregion

    /// <summary>
    /// The SQLInvestmentRepository
    /// </summary>
    /// <seealso cref="NedbankRepository.IInvestmentRepository" />
    public class SQLInvestmentRepository : IInvestmentRepository
    {
        #region Private Members

        /// <summary>
        /// The validation engine object
        /// </summary>
        INedBankValidationEngine validationEngine = null;

        /// <summary>
        /// The connection string
        /// </summary>
        private string connectionString = string.Empty;

        /// <summary>
        /// The unity container
        /// </summary>
        private IUnityContainer unityContainer = null;

        /// <summary>
        /// The configurationutility
        /// </summary>
        private IConfigurationUtility configurationutility = null;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializing instance of class.
        /// </summary>
        /// <param name="unityContainer">The unity container.</param>
        public SQLInvestmentRepository(IUnityContainer unityContainer)
        {
            this.unityContainer = unityContainer;
            this.validationEngine = new NedBankValidationEngine();
            this.configurationutility = new ConfigurationUtility(this.unityContainer);
        }

        #endregion

        #region Public Functions

        /// <summary>
        /// Gets the investment pottfolio by invester identifier.
        /// </summary>
        /// <param name="investorId">The investor identifier.</param>
        /// <param name="tenantCode">The tenant code.</param>
        /// <returns></returns>
        /// <exception cref="NedBankException.RepositoryStoreNotAccessibleException"></exception>
        public IList<InvestmentPottfolio> GetInvestmentPottfolioByInvesterId(long investorId, string tenantCode)
        {
            IList<InvestmentPottfolio> investments = new List<InvestmentPottfolio>();
            IList<NB_InvestmentMaster> investmentRecords = null;
            try
            {
                this.SetAndValidateConnectionString(tenantCode);
                using (NedbankEntities nedbankEntities = new NedbankEntities(this.connectionString))
                {
                    string whereClause = this.WhereClauseGenerator(investorId, tenantCode);
                    investmentRecords = new List<NB_InvestmentMaster>();
                    investmentRecords = nedbankEntities.NB_InvestmentMaster.Where(whereClause).ToList();
                }
                IList<InvestmentPottfolio> tempInvestments = new List<InvestmentPottfolio>();
                investmentRecords?.ToList().ForEach(investmentRecord =>
                {
                    tempInvestments.Add(new InvestmentPottfolio()
                    {
                        InvestorId = investmentRecord.InvestorId,
                        ProductType = investmentRecord.ProductType,
                        StatementDate = investmentRecord.StatementDate,
                        DayOfStatement = investmentRecord.DayOfStatement,
                        StatementPeriod = investmentRecord.StatementPeriod,
                        ClosingBalance = investmentRecord.ClosingBalance,
                        Currency = investmentRecord.Currency,
                    });
                });
                investments = tempInvestments;
            }
            catch (SqlException)
            {
                throw new RepositoryStoreNotAccessibleException(tenantCode);
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return investments;
        }

        /// <summary>
        /// Gets the investor performance by invester identifier.
        /// </summary>
        /// <param name="investorId">The investor identifier.</param>
        /// <param name="tenantCode">The tenant code.</param>
        /// <returns></returns>
        /// <exception cref="NedBankException.RepositoryStoreNotAccessibleException"></exception>
        public IList<InvestorPerformance> GetInvestorPerformanceByInvesterId(long investorId, string tenantCode)
        {
            IList<InvestorPerformance> investors = new List<InvestorPerformance>();
            IList<NB_InvestmentMaster> investorRecords = null;
            try
            {
                this.SetAndValidateConnectionString(tenantCode);
                using (NedbankEntities nedbankEntities = new NedbankEntities(this.connectionString))
                {
                    string whereClause = this.WhereClauseGenerator(investorId, tenantCode);
                    investorRecords = new List<NB_InvestmentMaster>();
                    investorRecords = nedbankEntities.NB_InvestmentMaster.Where(whereClause).ToList();
                }
                IList<InvestorPerformance> tempInvestments = new List<InvestorPerformance>();
                investorRecords?.ToList().ForEach(investmentRecord =>
                {
                    tempInvestments.Add(new InvestorPerformance()
                    {
                        ClosingBalance = investmentRecord.ClosingBalance,
                        OpeningBalance = investmentRecord.OpeningBalance,
                        ProductType = investmentRecord.ProductType,
                        Currency = investmentRecord.Currency,
                    });
                });
                investors = tempInvestments;
            }
            catch (SqlException)
            {
                throw new RepositoryStoreNotAccessibleException(tenantCode);
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return investors;
        }

        /// <summary>
        /// Gets the breakdown of investment accounts by invester identifier.
        /// </summary>
        /// <param name="investorId">The investor identifier.</param>
        /// <param name="tenantCode">The tenant code.</param>
        /// <returns></returns>
        /// <exception cref="NedBankException.RepositoryStoreNotAccessibleException"></exception>
        public IList<BreakdownOfInvestmentAccounts> GetBreakdownOfInvestmentAccountsByInvesterId(long investorId, string tenantCode)
        {
            IList<BreakdownOfInvestmentAccounts> breakdownOfInvestmentAccounts = new List<BreakdownOfInvestmentAccounts>();
            //IList<InvestmentTransaction> investmentTransactions = new List<InvestmentTransaction>();
            IList<NB_InvestmentMaster> investmentRecords = null;
            IList<NB_InvestmentTransaction> investmentTransactionRecords = null;
            try
            {
                this.SetAndValidateConnectionString(tenantCode);
                using (NedbankEntities nedbankEntities = new NedbankEntities(this.connectionString))
                {
                    string whereClause = this.WhereClauseGenerator(investorId, tenantCode);
                    investmentTransactionRecords = new List<NB_InvestmentTransaction>();
                    investmentTransactionRecords = nedbankEntities.NB_InvestmentTransaction.Where(whereClause).ToList();
                    investmentRecords = new List<NB_InvestmentMaster>();
                    investmentRecords = nedbankEntities.NB_InvestmentMaster.Where(whereClause).ToList();
                    //breakdownOfInvestmentAccounts = nedbankEntities.NB_InvestmentMaster
                    //    .Join(investmentTransactionRecords, i => i.InvestorId, it => it.InvestorId, (i, it) => new { i, it})
                    //    .Where(whereClause)
                    //    .Select(item => new BreakdownOfInvestmentAccounts()
                    //    {
                    //        InvestmentId = item.i.InvestorId,
                    //        CurrentInterestRate = item.i.CurrentInterestRate,
                    //        InterestDisposalDesc = item.i.InterestDisposalDesc,
                    //        AccountOpenDate = item.i.AccountOpenDate,
                    //        NoticePeriod = item.i.NoticePeriod,
                    //        TransactionDate = item.it.TransactionDate,
                    //    }).ToList();

                }

                IList<InvestmentTransaction> tempInvestmentTransactions = new List<InvestmentTransaction>();
                investmentTransactionRecords?.ToList().ForEach(investmentTransactionRecord =>
                {
                    tempInvestmentTransactions.Add(new InvestmentTransaction()
                    {
                        TransactionDate = investmentTransactionRecord.TransactionDate,
                        TransactionDesc = investmentTransactionRecord.TransactionDesc,
                        WJXBFS2_Debit = investmentTransactionRecord.WJXBFS2_Debit,
                        WJXBFS3_Credit = investmentTransactionRecord.WJXBFS3_Credit,
                        WJXBFS4_Balance = investmentTransactionRecord.WJXBFS4_Balance,
                    });
                });

                IList<BreakdownOfInvestmentAccounts> tempInvestments = new List<BreakdownOfInvestmentAccounts>();

                investmentRecords?.ToList().ForEach(investmentRecord =>
                {
                    tempInvestments.Add(new BreakdownOfInvestmentAccounts()
                    {
                        InvestmentId = investmentRecord.InvestmentId,
                        CurrentInterestRate = investmentRecord.CurrentInterestRate,
                        InterestDisposalDesc = investmentRecord.InterestDisposalDesc,
                        AccountOpenDate = investmentRecord.AccountOpenDate,
                        NoticePeriod = investmentRecord.NoticePeriod,
                        LastTransactionDate = tempInvestmentTransactions.Count() > 0 ? tempInvestmentTransactions.Max(a => a.TransactionDate) : DateTime.Now,
                        InvestmentTransaction = tempInvestmentTransactions,
                        InvestorId = investmentRecord.InvestorId,
                        ProductDescription = investmentRecord.ProductDesc,
                        Currency = investmentRecord.Currency
                    });
                });
                breakdownOfInvestmentAccounts = tempInvestments;
            }
            catch (SqlException)
            {
                throw new RepositoryStoreNotAccessibleException(tenantCode);
            }
            catch (Exception exception)
            {
                throw exception;
            }
            return breakdownOfInvestmentAccounts;
        }
        #endregion

        #region Private Method

        /// <summary>
        /// This method help to set and validate connection string
        /// </summary>
        /// <param name="tenantCode">The tenant code</param>
        /// <exception cref="NedBankException.ConnectionStringNotFoundException"></exception>
        private void SetAndValidateConnectionString(string tenantCode)
        {
            try
            {
                this.connectionString = this.configurationutility.GetConnectionString(ModelConstant.COMMON_SECTION, ModelConstant.NIS_CONNECTION_STRING, ModelConstant.CONFIGURATON_BASE_URL, ModelConstant.TENANT_CODE_KEY, tenantCode);
                if (!this.validationEngine.IsValidText(this.connectionString))
                {
                    throw new ConnectionStringNotFoundException(tenantCode);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Generate string for dynamic linq.
        /// </summary>
        /// <param name="investorId">The investor identifier.</param>
        /// <param name="tenantCode">The tenant code.</param>
        /// <returns>
        /// Returns a string.
        /// </returns>
        private string WhereClauseGenerator(long investorId, string tenantCode)
        {
            StringBuilder queryString = new StringBuilder();
            if (tenantCode != ModelConstant.DEFAULT_TENANT_CODE)
            {
                queryString.Append(string.Format(" TenantCode.Equals(\"{0}\") and", tenantCode));
            }
            queryString.Append(string.Format(" InvestorId.Equals({0})", investorId));

            return queryString.ToString();
        }

        #endregion
    }
}
