import type { ApiSuccess } from "@/types/api";
import type { PlusPageData } from "@/features/plus/types";
import { plusPageMock } from "@/features/plus/mocks/plus.mock";

const SIMULATED_LATENCY_MS = 400;

export const plusRepository = {
  async getPlusPage(): Promise<ApiSuccess<PlusPageData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return plusPageMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<PlusPageData>>("/membership/plus");
    // return data;
  },
};
