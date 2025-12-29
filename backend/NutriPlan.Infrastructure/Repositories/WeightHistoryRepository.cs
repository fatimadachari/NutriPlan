using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class WeightHistoryRepository : IWeightHistoryRepository
{
    private readonly AppDbContext _context;

    public WeightHistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WeightHistory>> GetByPatientIdAsync(Guid patientId)
    {
        return await _context.WeightHistories
            .AsNoTracking()
            .Where(w => w.PatientId == patientId)
            .OrderByDescending(w => w.MeasurementDate)
            .ToListAsync();
    }

    public async Task<WeightHistory?> GetByIdAsync(Guid id)
    {
        return await _context.WeightHistories
            .AsNoTracking()
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<WeightHistory> CreateAsync(WeightHistory weightHistory)
    {
        await _context.WeightHistories.AddAsync(weightHistory);
        await _context.SaveChangesAsync();
        return weightHistory;
    }

    public async Task<WeightHistory> UpdateAsync(WeightHistory weightHistory)
    {
        _context.WeightHistories.Update(weightHistory);
        await _context.SaveChangesAsync();
        return weightHistory;
    }

    public async Task DeleteAsync(Guid id)
    {
        var weightHistory = await _context.WeightHistories.FindAsync(id);
        if (weightHistory != null)
        {
            _context.WeightHistories.Remove(weightHistory);
            await _context.SaveChangesAsync();
        }
    }
}