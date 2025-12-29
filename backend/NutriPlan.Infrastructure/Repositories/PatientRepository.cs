using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync()
    {
        return await _context.Patients
            .AsNoTracking()
            .Include(p => p.PatientAllergies)
                .ThenInclude(pa => pa.Allergy)
            .Include(p => p.PatientHealthConditions)
                .ThenInclude(phc => phc.HealthCondition)
            .Include(p => p.PatientDietaryPreferences)
                .ThenInclude(pdp => pdp.DietaryPreference)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Patient?> GetByIdAsync(Guid id)
    {
        return await _context.Patients
            .AsNoTracking()
            .Include(p => p.PatientAllergies)
                .ThenInclude(pa => pa.Allergy)
            .Include(p => p.PatientHealthConditions)
                .ThenInclude(phc => phc.HealthCondition)
            .Include(p => p.PatientDietaryPreferences)
                .ThenInclude(pdp => pdp.DietaryPreference)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        await _context.Patients.AddAsync(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient> UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task DeleteAsync(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient != null)
        {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateRestrictionsAsync(Guid patientId, List<Guid> allergyIds, List<Guid> healthConditionIds, List<Guid> dietaryPreferenceIds)
    {
        // Remover restrições antigas
        var oldAllergies = await _context.PatientAllergies
            .Where(pa => pa.PatientId == patientId)
            .ToListAsync();
        _context.PatientAllergies.RemoveRange(oldAllergies);

        var oldConditions = await _context.PatientHealthConditions
            .Where(phc => phc.PatientId == patientId)
            .ToListAsync();
        _context.PatientHealthConditions.RemoveRange(oldConditions);

        var oldPreferences = await _context.PatientDietaryPreferences
            .Where(pdp => pdp.PatientId == patientId)
            .ToListAsync();
        _context.PatientDietaryPreferences.RemoveRange(oldPreferences);

        // Adicionar novas restrições
        foreach (var allergyId in allergyIds)
        {
            await _context.PatientAllergies.AddAsync(new PatientAllergy
            {
                PatientId = patientId,
                AllergyId = allergyId,
                AddedAt = DateTime.UtcNow
            });
        }

        foreach (var conditionId in healthConditionIds)
        {
            await _context.PatientHealthConditions.AddAsync(new PatientHealthCondition
            {
                PatientId = patientId,
                HealthConditionId = conditionId,
                DiagnosedAt = DateTime.UtcNow
            });
        }

        foreach (var preferenceId in dietaryPreferenceIds)
        {
            await _context.PatientDietaryPreferences.AddAsync(new PatientDietaryPreference
            {
                PatientId = patientId,
                DietaryPreferenceId = preferenceId,
                AddedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }
}