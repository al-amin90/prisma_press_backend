import { prisma } from "../../../lib/prisma";
import config from "../../config";
import { stripe } from "../../../lib/stripe";

const getPremiumContent = async () => {
  const result = await prisma.post.findMany({
    where: {
      isPremium: true,
    },
  });

  return result;
};

export const premiumServices = {
  getPremiumContent,
};
