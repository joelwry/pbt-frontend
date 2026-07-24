import { plusRepository } from "@/features/plus/repositories/plus.repository";
import type { PlusPageData } from "@/features/plus/types";

export const plusService = {
  async getPlusPage(): Promise<PlusPageData> {
    const response = await plusRepository.getPlusPage();
    return response.data;
  },
};
