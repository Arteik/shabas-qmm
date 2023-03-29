import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";


const inputType = z.object({
    id: z.number().optional(),
    description: z.string(),
    status: z.string(),
    start_date: z.string(),
    end_date: z.date(),
    site_description: z.string(),
    site_address: z.string(),
    site_id: z.number(),
    engagement_id: z.number(),
})

export const assessmentRouter = createTRPCRouter({
    upsert: publicProcedure
        .input(inputType)
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.upsert({
                where: { id: input.id },
                update: {
                    status: input.status,
                    description: input.description,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    last_updated: new Date(),
                    last_updated_by: '',
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                },
                create: {
                    status: input.status,
                    description: input.description,
                    start_date: input.start_date,
                    end_date: input.end_date,
                    site_id: input.site_id,
                    engagement_id: input.engagement_id,
                    created_by: '',
                    last_updated_by: '',
                }
            })
        }),
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.assessment.findUnique({
                where: { id: input.id }
            });
        }),
    getAll: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.assessment.findMany();
        }),
});
