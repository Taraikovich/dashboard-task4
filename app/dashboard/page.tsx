import { fetchUsers } from '../lib/data';
import Dashbord from '../ui/dashbord';
import PaginatedList from '../ui/pagination';

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const itemsPerPage = 5;
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const { users, count } = await fetchUsers(
    itemsPerPage,
    (currentPage - 1) * itemsPerPage
  );

  return (
    <>
      <Dashbord users={users} />
      <PaginatedList totalPages={Math.ceil(count / itemsPerPage)} />
    </>
  );
}
