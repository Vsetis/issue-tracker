const Tag = ({ children }: { children: React.ReactNode }) => {
  const status = children;
  return (
    <p
      className={`${
        status === "OPEN"
          ? "bg-green-500/20 text-green-700"
          : status === "IN_PROGRESS"
          ? "bg-orange-500/20 text-orange-700"
          : status === "CLOSED"
          ? "bg-red-500/20 text-red-700"
          : ""
      } w-max rounded px-1 text-center text-[12px] font-medium`}
    >
      {children}
    </p>
  );
};

export default Tag;
