interface LoadingProps {
    contents: string;
}

export default function Loading({ contents }: LoadingProps) {
    return (
        <div className="flex items-center justify-center py-16 text-base text-muted pc:text-[20px]">
            {contents}
        </div>
    );
}
