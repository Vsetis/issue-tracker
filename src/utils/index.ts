export function getOrderOption(orderOption?: string): Partial<{
  [key in "createdAt" | "title" | "status"]: "asc" | "desc";
}> {
  switch (orderOption) {
    case "time":
      return { createdAt: "desc" };
    case "title":
      return { title: "asc" };
    case "status":
      return { status: "asc" };
    default:
      return { createdAt: "desc" };
  }
}
