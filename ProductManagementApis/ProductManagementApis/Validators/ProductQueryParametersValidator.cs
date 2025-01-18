using FluentValidation;

namespace ProductManagementApis.Validators
{
    public class ProductQueryParametersValidator : AbstractValidator<ProductQueryParameters>
    {
        public ProductQueryParametersValidator()
        {
            RuleFor(x => x.MinPrice)
                .LessThanOrEqualTo(x => x.MaxPrice)
                .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue)
                .WithMessage("MinPrice must be less than or equal to MaxPrice.");
        }
    }
    public class ProductQueryParameters
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Name { get; set; }
    }
}
