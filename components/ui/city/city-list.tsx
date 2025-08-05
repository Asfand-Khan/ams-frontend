"use client";

import { fetchCityList } from '@/helperFunctions/cityFunction';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import Error from '../foundations/error';
import Empty from '../foundations/empty';
import DatatableColumnHeader from '../datatable/datatable-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnMeta } from '@/types/dataTableTypes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Button } from '../shadcn/button';
import Link from 'next/link';
import SubNav from '../foundations/sub-nav';
import { CityResponseType, CityPayloadType } from '@/types/cityTypes';
import CityDatatable from './city-datatable';
import { getRights } from '@/utils/getRights';
import { Badge } from '../shadcn/badge';
import LoadingState from '../foundations/loading-state';
import useCityIdStore from '@/hooks/useCityIdStore';

const CityList = () => {  // Constants
  // Constants
  const ADD_URL = '/cites-couiers/add-cities'
  const EDIT_URL = '/cites-couiers/edit-cities'

  const router = useRouter();
  const pathname = usePathname();
  const { setCityId } = useCityIdStore();

  // Fetch city list data using react-query
  const { data: cityListResponse, isLoading: cityListLoading, isError: cityListIsError, error: cityListError } = useQuery<CityResponseType | null>({
    queryKey: ['city-list'],
    queryFn: fetchCityList,
  });

  // Column filter options
  const cityNameFilterOptions = useMemo(() => {
    const allNames = cityListResponse?.payload?.map((item) => item.city_name) || [];
    const uniqueNames = Array.from(new Set(allNames));
    return uniqueNames.map((name) => ({
      label: name,
      value: name,
    }));
  }, [cityListResponse]);

  const igisCityCodeFilterOptions = useMemo(() => {
    const allIgisCityCodes = cityListResponse?.payload?.map((item) => item.igis_city_code) || [];
    const uniqueIgisCityCodes = Array.from(new Set(allIgisCityCodes));
    return uniqueIgisCityCodes.map((igis_city_code) => ({
      label: igis_city_code,
      value: igis_city_code,
    }));
  }, [cityListResponse]);

  const createdByFilterOptions = useMemo(() => {
    const allCreatedBy = cityListResponse?.payload?.map((item) => item.created_by.toString()) || [];
    const uniqueCreatedBy = Array.from(new Set(allCreatedBy));
    return uniqueCreatedBy.map((created_by) => ({
      label: created_by,
      value: created_by,
    }));
  }, [cityListResponse]);

  // Define columns for the data table
  const columns: ColumnDef<CityPayloadType>[] = [
    {
      accessorKey: 'igis_city_code',
      header: ({ column }) => <DatatableColumnHeader column={column} title="IGIS City Code" />,
      cell: ({ row }) => <div>{row.getValue("igis_city_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: igisCityCodeFilterOptions,
        filterPlaceholder: "Filter IGIS city code...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'city_name',
      header: ({ column }) => <DatatableColumnHeader column={column} title="City Name" />,
      cell: ({ row }) => <div>{row.getValue("city_name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: cityNameFilterOptions,
        filterPlaceholder: "Filter city name...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'created_by',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Created By" />,
      cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: createdByFilterOptions,
        filterPlaceholder: "Filter created by...",
      } as ColumnMeta,
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => <DatatableColumnHeader column={column} title="Status" />,
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        return (
          <Badge className="justify-center py-1 min-w-[50px] w-[70px]" variant={status === "active" ? "success" : "danger"}>
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ],
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rights?.can_edit === "1" && (
                <DropdownMenuItem asChild>
                  <Link href={EDIT_URL} onClick={() => setCityId(record.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_edit === "1" && (
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Rights
  const rights = useMemo(() => {
    return getRights(pathname);
  }, [pathname]);

  if (rights?.can_view !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to view city listing." />;
  }

  // Loading state
  if (cityListLoading) {
    return <LoadingState />;
  }

  // Error state
  if (cityListIsError) {
    return <Error err={cityListError?.message} />;
  }

  // Empty state
  if (!cityListResponse?.payload || cityListResponse.payload.length === 0) {
    return <Empty title="Not Found" description="No cities found" />;
  }

  return (
    <>
      <SubNav title="City List" addBtnTitle="Add City" urlPath={ADD_URL} />
      <CityDatatable columns={columns} payload={cityListResponse?.payload || []} />
    </>
  );
};

export default CityList;