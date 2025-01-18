using FluentValidation;
using ProductManagementApis.Dtos;

namespace ProductManagementApis.Validators
{
    public class CreateUpdateProductRequestValidator : AbstractValidator<CreateUpdateProductDto>
    {
        public CreateUpdateProductRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Price).GreaterThan(0);
        }
    }
}
