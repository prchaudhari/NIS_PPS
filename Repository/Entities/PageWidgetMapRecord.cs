//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace nIS
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("NIS.PageWidgetMap")]
    public partial class PageWidgetMapRecord
    {
        public long Id { get; set; }
        public long ReferenceWidgetId { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public int Xposition { get; set; }
        public int Yposition { get; set; }
        public long PageId { get; set; }
        public string WidgetSetting { get; set; }
        public string TenantCode { get; set; }
        public bool IsDynamicWidget { get; set; }
    }
}
