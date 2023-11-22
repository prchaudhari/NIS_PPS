﻿// <copyright file="IncomeSources.cs" company="Websym Solutions Pvt. Ltd.">
// Copyright (c) 2020 Websym Solutions Pvt. Ltd..
// </copyright>
//-----------------------------------------------------------------------

namespace nIS
{
    #region References
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel;
    #endregion

    public class IncomeSources
    {
        public long Identifier { get; set; }
        public long CustomerId { get; set; }
        public long BatchId { get; set; }
        public string Source { get; set; }
        public string CurrentSpend { get; set; }
        public string AverageSpend { get; set; }
        public string TenantCode { get; set; }
    }
}
