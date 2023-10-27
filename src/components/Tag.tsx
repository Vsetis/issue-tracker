const Tag = ({ children }: { children: React.ReactNode }) => {
  const status = children;
  return (
    <p
      className={`${
        status === "OPEN"
          ? "bg-green-500/20 text-green-500"
          : status === "IN_PROGRESS"
          ? "bg-orange-500/20 text-orange-500"
          : status === "CLOSED"
          ? "bg-red-500/20 text-red-500"
          : ""
      } w-max rounded px-1 text-center text-sm font-semibold`}
    >
      {children}
    </p>
  );
};

export default Tag;
