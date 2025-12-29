using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class BodyMeasurementRepository : IBodyMeasurementRepository
{
    private readonly AppDbContext _context;

    public BodyMeasurementRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BodyMeasurement>> GetByPatientIdAsync(Guid patientId)
    {
        return await _context.BodyMeasurements
            .AsNoTracking()
            .Where(b => b.PatientId == patientId)
            .OrderByDescending(b => b.MeasurementDate)
            .ToListAsync();
    }

    public async Task<BodyMeasurement?> GetByIdAsync(Guid id)
    {
        return await _context.BodyMeasurements
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<BodyMeasurement> CreateAsync(BodyMeasurement bodyMeasurement)
    {
        await _context.BodyMeasurements.AddAsync(bodyMeasurement);
        await _context.SaveChangesAsync();
        return bodyMeasurement;
    }

    public async Task DeleteAsync(Guid id)
    {
        var bodyMeasurement = await _context.BodyMeasurements.FindAsync(id);
        if (bodyMeasurement != null)
        {
            _context.BodyMeasurements.Remove(bodyMeasurement);
            await _context.SaveChangesAsync();
        }
    }
}