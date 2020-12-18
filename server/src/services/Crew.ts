import { Person } from "../types/Movies";
import { getPersonById } from "../db/DB";

export const getPerson = (id: string): Person => getPersonById(id);