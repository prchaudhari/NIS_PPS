﻿// <copyright file="ScheduleNotFoundException.cs" company="Websym Solutions Pvt. Ltd.">
//  Copyright (c) 2018  Websym Solutions Pvt. Ltd. 
// </copyright>

namespace nIS
{
    #region References

    using System;

    #endregion

    /// <summary>
    /// This class implements role not found exception which will be raised 
    /// when an attempt is made to access role which is not present in store.
    /// </summary>
    public class ScheduleNotFoundException : Exception
    {
        #region Private Members

        /// <summary>
        /// The tenantCode Code
        /// </summary>
        public string tenantCode = string.Empty;

        #endregion

        #region Constructor

        /// <summary>
        /// Parameterized constructor for role not found exception.
        /// </summary>
        /// <param name="tenantCode">The tenant code.</param>
        public ScheduleNotFoundException(string tenantCode)
        {
            this.tenantCode = tenantCode;
        }

        #endregion

        #region Public Members

        /// <summary>
        /// This method overrides the exception message.
        /// </summary>    

        public override string Message
        {
            get
            {
                return ExceptionConstant.SCHEDULE_EXCEPTION + "~" + ExceptionConstant.SCHEDULE_NOT_FOUND_EXCEPTION;
            }
        }

        #endregion
    }
}
