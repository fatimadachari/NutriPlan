using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NutriPlan.Application.Interfaces;
using NutriPlan.Domain.Entities;
using NutriPlan.Infrastructure.Data;

namespace NutriPlan.Infrastructure.Repositories
{
    public class AnamneseRepository : IAnamneseRepository
    {
        private readonly AppDbContext _context;

        public AnamneseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Anamnese?> GetByIdAsync(Guid id)
        {
            return await _context.Anamneses
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Anamnese?> GetByPatientIdAsync(Guid patientId)
        {
            return await _context.Anamneses
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.PatientId == patientId);
        }

        public async Task<IEnumerable<Anamnese>> GetAllAsync()
        {
            return await _context.Anamneses
                .Include(a => a.Patient)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<Anamnese> CreateAsync(Anamnese anamnese)
        {
            _context.Anamneses.Add(anamnese);
            await _context.SaveChangesAsync();

            // Reload with Patient
            return await GetByIdAsync(anamnese.Id) ?? anamnese;
        }

        public async Task<Anamnese> UpdateAsync(Anamnese anamnese)
        {
            anamnese.UpdatedAt = DateTime.UtcNow;
            _context.Anamneses.Update(anamnese);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(anamnese.Id) ?? anamnese;
        }

        public async Task DeleteAsync(Guid id)
        {
            var anamnese = await _context.Anamneses.FindAsync(id);
            if (anamnese != null)
            {
                _context.Anamneses.Remove(anamnese);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> PatientHasAnamneseAsync(Guid patientId)
        {
            return await _context.Anamneses
                .AnyAsync(a => a.PatientId == patientId);
        }
    }
}