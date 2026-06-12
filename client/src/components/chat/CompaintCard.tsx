import type React from "react";

export interface ComplaintCardProps {
    title: string;
    description: string;
    image?: string;
    category: string;
    priority: "low" | "medium" | "high" | "critical";
    status: string;
    createdAt: string;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ title, description, image, category, priority, status, createdAt }) => {

    const priorityColors = {
        low: "bg-green-500/15 text-green-400 ring-1 ring-green-500/25",
        medium: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/25",
        high: "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25",
        critical: "bg-red-500/15 text-red-400 ring-1 ring-red-500/25",
        urgent: "bg-red-500 text-red-200 ring-1 ring-red-500/25",
    };

    const date = new Date(createdAt);

    const formatted = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <div className="w-full sm:max-w-100 max-w-60 rounded-2xl glass ai-glow p-5 transition hover:shadow-lg hover:shadow-primary-600/10">
            {/* Header */}
            {image &&
                <div className="w-auto aspect-video object-contain rounded-xl overflow-hidden mb-4 ring-1 ring-border-subtle">
                    <img className="w-full object-cover aspect-auto" src={image} alt="image" />
                </div>
            }
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="sm:text-lg text-base font-semibold text-text-primary">{title}</h3>
                    <p className="mt-1 text-sm text-text-muted">
                        {formatted}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${priorityColors[priority]
                        }`}
                >
                    {priority}
                </span>
            </div>

            {/* Description */}
            <p className="mt-4 line-clamp-3 text-sm sm:leading-6 text-text-secondary">
                {description}
            </p>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-primary-400/15 px-3 py-1 text-xs font-medium text-primary-300 ring-1 ring-primary-400/20">
                    {category}
                </span>

                <span className="rounded-lg bg-surface-hover px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-subtle">
                    {status}
                </span>
            </div>
        </div>
    );
}
