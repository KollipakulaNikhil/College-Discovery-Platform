import { savedCollegeRepository } from "@/lib/repository/saved.repository";
import { prisma } from "@/lib/prisma";

export class SavedService {
  async getSavedColleges(userId: string) {
    return savedCollegeRepository.findByUserId(userId);
  }

  async saveCollege(userId: string, collegeId: string) {
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) throw new Error("College not found");

    const existing = await savedCollegeRepository.findOne(userId, collegeId);
    if (existing) throw new Error("College already saved");

    return savedCollegeRepository.create(userId, collegeId);
  }

  async unsaveCollege(userId: string, collegeId: string) {
    const existing = await savedCollegeRepository.findOne(userId, collegeId);
    if (!existing) throw new Error("Saved college not found");

    return savedCollegeRepository.delete(userId, collegeId);
  }

  async getSavedCollegeIds(userId: string): Promise<string[]> {
    return savedCollegeRepository.getSavedCollegeIds(userId);
  }

  async isCollegeSaved(userId: string, collegeId: string): Promise<boolean> {
    const saved = await savedCollegeRepository.findOne(userId, collegeId);
    return !!saved;
  }
}

export const savedService = new SavedService();
