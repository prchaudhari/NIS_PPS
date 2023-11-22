// <copyright file="CustomerAccountSearchParameter.cs" company="Websym Solutions Pvt Ltd">
// Copyright (c) 2018 Websym Solutions Pvt Ltd.
// </copyright>
// -----------------------------------------------------------------------  

namespace nIS
{

    #region References
    using System;
    using System.Collections.Generic;
    using System.Dynamic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion

    /// <summary>
    /// This class represents customer account search parameter
    /// </summary>
    /// 
    public class CustomerAccountSearchParameter
    {
        /// <summary>
        /// The utility object
        /// </summary>
        private ModelUtility utility = new ModelUtility();

        /// <summary>
        /// The validation engine objecct
        /// </summary>
        private IValidationEngine validationEngine = new ValidationEngine();

        public long Identifier { get; set; } //send account id value to this property when account master data fetching
        public long BatchId { get; set; }
        public long CustomerId { get; set; }
        public long AccountId { get; set; } //send account id value to this property when account transaction data fetching
        public string AccountType { get; set; }
        public string WidgetFilterSetting { get; set; }


        /// <summary>
        /// Determines whether this instance of customer account search parameter is valid.
        /// </summary>
        public void IsValid()
        {
            try
            {
                Exception exception = new Exception();

                if (validationEngine.IsValidLong(this.BatchId))
                {
                    exception.Data.Add(this.utility.GetDescription("Batch Id", typeof(State)), ModelConstant.TRANSACTION_DATA_MODEL_SECTION + "~" + ModelConstant.INVALID_BATCH_ID);
                }
                if (validationEngine.IsValidLong(this.CustomerId))
                {
                    exception.Data.Add(this.utility.GetDescription("Customer Id", typeof(State)), ModelConstant.TRANSACTION_DATA_MODEL_SECTION + "~" + ModelConstant.INVALID_CUSTOMER_ID);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
