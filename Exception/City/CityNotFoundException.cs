﻿// <copyright file="CityNotFoundException.cs" company="Websym Solutions Pvt. Ltd.">
// Copyright (c) 2018 Websym Solutions Pvt. Ltd..
// </copyright>
//-----------------------------------------------------------------------
namespace nIS
{
    #region References

    using System;

    #endregion

    /// <summary>
    /// This class represent city not found exception Class.
    /// </summary>
    public class CityNotFoundException : Exception
    {
        #region Private Members

        /// <summary>
        /// The tenantCode Code
        /// </summary>
        public string tenantCode = string.Empty;

        #endregion

        #region Constructor

        /// <summary>
        /// Parameterized constructor for certification not found exception.
        /// </summary>
        /// <param name="tenantCode">The tenant code.</param>
        public CityNotFoundException(string tenantCode)
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
                return ExceptionConstant.CITY_EXCEPTION_SECTION + "~" + ExceptionConstant.CITY_NOT_FOUND_EXCEPTION;
            }
        }

        #endregion
    }
}
