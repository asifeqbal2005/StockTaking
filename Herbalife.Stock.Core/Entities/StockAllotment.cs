using Herbalife.Stock.Core.Interfaces;

namespace Herbalife.Stock.Core.Entities
{
    public class StockAllotment : EntityBase, IAggregateRoot
    {
        public string? Row { get; set; }
        public long OperatorId1 { get; set; }
        public long OperatorId2 { get; set; }
        public bool IsOper1Start { get; set; }
        public bool IsOper2Start { get; set; }
        public bool IsOper1Complete { get; set; }
        public bool IsOper2Complete { get; set; }
        public bool IsSupervisorSubmit { get; set; }
        public bool IsManagerFinalize { get; set; }
    }
}
