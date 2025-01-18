using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementApis.Data;
using ProductManagementApis.Data.Entities;
using ProductManagementApis.Dtos;
using ProductManagementApis.Validators;

namespace ProductManagementApis.Endpoints
{
    public static class ProductEndpointsExtensions
    {
        public static void AddProductEndpoints(this WebApplication app)
        {
            var productGroup = app.MapGroup("/api/products");

            productGroup.MapGet("/", async (
                [FromQuery] decimal? minPrice,
                [FromQuery] decimal? maxPrice,
                [FromQuery] string? name,
                AppDbContext context,
                IValidator<ProductQueryParameters> validator) =>
            {
                var queryParameters = new ProductQueryParameters
                {
                    MinPrice = minPrice,
                    MaxPrice = maxPrice,
                    Name = name
                };

                var validationResult = await validator.ValidateAsync(queryParameters);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var query = context.Products.AsQueryable();

                if (!string.IsNullOrEmpty(name))
                {
                    query = query.Where(p => p.Name.Contains(name));
                }

                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                var products = await query
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        CreatedDate = p.CreatedDate
                    })
                    .ToListAsync();

                return Results.Ok(products);
            }).Produces<List<ProductDto>>(StatusCodes.Status200OK)
              .Produces<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest);

            productGroup.MapGet("/{id}", async (Guid id, AppDbContext context) =>
            {
                var product = await context.Products.FindAsync(id);
                if (product is null) return Results.NotFound();

                var response = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    CreatedDate = product.CreatedDate
                };

                return Results.Ok(response);
            }).Produces<ProductDto>(StatusCodes.Status200OK)
              .Produces(StatusCodes.Status404NotFound);

            productGroup.MapPost("/", async (CreateUpdateProductDto request, AppDbContext context, IValidator<CreateUpdateProductDto> validator) =>
            {
                var validationResult = await validator.ValidateAsync(request);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    CreatedDate = DateTime.UtcNow
                };

                context.Products.Add(product);
                await context.SaveChangesAsync();

                var response = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    CreatedDate = product.CreatedDate
                };

                return Results.Created($"/api/products/{product.Id}", response);
            }).Produces<ProductDto>(StatusCodes.Status201Created)
              .Produces<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest);

            productGroup.MapPut("/{id}", async (Guid id, CreateUpdateProductDto request, AppDbContext context, IValidator<CreateUpdateProductDto> validator) =>
            {
                var validationResult = await validator.ValidateAsync(request);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var product = await context.Products.FindAsync(id);
                if (product is null) return Results.NotFound();

                product.Name = request.Name;
                product.Description = request.Description;
                product.Price = request.Price;

                await context.SaveChangesAsync();

                return Results.NoContent();
            }).Produces(StatusCodes.Status204NoContent)
              .Produces<HttpValidationProblemDetails>(StatusCodes.Status400BadRequest)
              .Produces(StatusCodes.Status404NotFound);

            productGroup.MapDelete("/{id}", async (Guid id, AppDbContext context) =>
            {
                var product = await context.Products.FindAsync(id);
                if (product is null) return Results.NotFound();

                context.Products.Remove(product);
                await context.SaveChangesAsync();

                return Results.NoContent();
            }).Produces(StatusCodes.Status204NoContent)
              .Produces(StatusCodes.Status404NotFound);
        }
    }
}