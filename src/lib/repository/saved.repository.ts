import { prisma } from "@/lib/prisma";

export class SavedCollegeRepository {
  async findByUserId(userId: string) {
    return prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            _count: {
              select: { courses: true, reviews: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(userId: string, collegeId: string) {
    return prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });
  }

  async create(userId: string, collegeId: string) {
    return prisma.savedCollege.create({
      data: { userId, collegeId },
    });
  }

  async delete(userId: string, collegeId: string) {
    return prisma.savedCollege.delete({
      where: { userId_collegeId: { userId, collegeId } },
    });
  }

  async getSavedCollegeIds(userId: string): Promise<string[]> {
    const saved = await prisma.savedCollege.findMany({
      where: { userId },
      select: { collegeId: true },
    });
    return saved.map((s: { collegeId: string }) => s.collegeId);
  }
}

export const savedCollegeRepository = new SavedCollegeRepository();
