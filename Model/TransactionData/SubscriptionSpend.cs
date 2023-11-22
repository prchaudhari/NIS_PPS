﻿// <copyright file="SubscriptionSpend.cs" company="Websym Solutions Pvt. Ltd.">
// Copyright (c) 2020 Websym Solutions Pvt. Ltd..
// </copyright>
//-----------------------------------------------------------------------

namespace nIS
{
    public class SubscriptionSpend
    {
        public long Identifier { get; set; }
        public long BatchId { get; set; }
        public long CustomerId { get; set; }
        public string Month { get; set; }
        public long Year { get; set; }
        public decimal Microsoft { get; set; }
        public decimal Zoom { get; set; }
        public string TenantCode { get; set; }
    }
}
