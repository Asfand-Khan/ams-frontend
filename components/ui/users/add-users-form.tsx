"use client";

import React, { useState } from 'react'
import { Button } from '../shadcn/button';
import { Label } from '../shadcn/label';
import { useForm, Controller } from 'react-hook-form';
import { UserSchema, UserSchemaType } from '@/schemas/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../shadcn/input';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosFunction } from '@/utils/axiosFunction';
import { UserResponseType } from '@/types/usersTypes';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { convertToBase64 } from '@/utils/convertToBase64';
import { allMenusPayloadType, MenuRightsTypes, RightsType } from '@/types/menus';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion"
import * as Icons from 'lucide-react';
import { Checkbox } from '../shadcn/checkbox';

interface AddUserFormProps {
  allMenus: allMenusPayloadType[] | undefined
}

const userTypeOptions: { value: string, label: string }[] = [
  { value: "api_user", label: "Api User" },
  { value: "dashboard_user", label: "Dashboard User" },
];

const statusOptions: { value: string, label: string }[] = [
  { value: "false", label: "In active" },
  { value: "true", label: "Active" },
];

const AddUsersForm: React.FC<AddUserFormProps> = ({ allMenus }) => {
  // Constants
  const LISTING_ROUTE = '/users/user-list'

  const router = useRouter()
  const [toggleEye, setToggleEye] = useState(false);
  const [menuRights, setMenuRights] = useState<MenuRightsTypes[]>([]);
  const queryClient = useQueryClient()

  // Form via react hook form
  const { handleSubmit, register, formState: { errors }, control, setValue } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      user_type: "dashboard_user",
      is_active: undefined,
      menu_rights: [],
      image: undefined,
    }
  })

  // Mutation handler
  const addUserMutation = useMutation<
    UserResponseType,
    AxiosError<UserResponseType>,
    UserSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/users/register",
        isServer: true,
        data: record
      })
    },
    onError: (err) => {
      const message = err?.response?.data?.message
      toast.error(message)
      console.log('Add user mutation error', err)
    },
    onSuccess: (data) => {
      const message = data?.message
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['users-list'] })
      router.push(LISTING_ROUTE)
    }
  })

  // Handle Rights
  const handleRights = ({ menu_id, rights, value }: { menu_id: number, rights: RightsType, value: boolean }) => {
    setMenuRights((prevState) => {
      const existingIndex = prevState.findIndex((entry) => entry.menu_id === menu_id);

      if (existingIndex !== -1) {
        // If the menu_id already exists, update that entry
        const updatedRights = [...prevState];
        updatedRights[existingIndex] = {
          ...updatedRights[existingIndex],
          [rights]: value,
        };
        return updatedRights;
      } else {
        return [
          ...prevState,
          {
            menu_id,
            can_view: false,
            can_create: false,
            can_edit: false,
            can_delete: false,
            [rights]: value,
          },
        ];
      }
    });
  };

  // Handle Profile Image
  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setValue('image', base64)
      } catch (err) {
        console.error("Error converting to Base64:", err);
        toast.error("Error converting to Base64")
        setValue('image', undefined)
      }
    }
  }

  // Submit Form
  const onSubmit = (data: UserSchemaType) => {

    if (menuRights.length === 0) {
      toast.error('Please assign at least one right to proceed.');
      return;
    }

    const finalData = {
      username: data.username.toLocaleLowerCase().replace(' ', ''),
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      user_type: data.user_type,
      is_active: data.is_active,
      menu_rights: menuRights,
      ...(data.image && { image: data.image }),

    }
    addUserMutation.mutate(finalData);
  }


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='username' className='gap-1 text-gray-600'>
              Username<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='username'
                placeholder='Enter Username'
                {...register('username')}
              />
              {errors.username && (
                <p className='text-red-500 text-sm'>
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='fullname' className='gap-1 text-gray-600'>
              Fullname<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='fullname'
                placeholder='Enter Fullname'
                {...register('fullname')}
              />
              {errors.fullname && (
                <p className='text-red-500 text-sm'>
                  {errors.fullname.message}
                </p>
              )}
            </div>

          </div>
          <div className='space-y-2'>
            <Label htmlFor='email' className='gap-1 text-gray-600'>
              Email<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='email'
                id='email'
                placeholder='Enter Email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone' className='gap-1 text-gray-600'>
              Phone Number<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Input
                type='text'
                id='phone'
                placeholder='Enter Phone Number'
                {...register('phone')}
              />
              {errors.phone && (
                <p className='text-red-500 text-sm'>
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password' className='gap-1 text-gray-600'>
              Password<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <div className='relative'>
                <Input
                  type={toggleEye ? 'text' : 'password'}
                  id='password'
                  placeholder='Enter Password'
                  {...register('password')}
                />
                <Button
                  type='button'
                  variant="ghost" size="sm" className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer' onClick={() => setToggleEye((prevState) => !prevState)}>
                  {toggleEye ? <Eye /> : <EyeOff />}
                </Button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='user_type' className='gap-1 text-gray-600'>
              User Type<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Controller
                name='user_type'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(selectedOption) => { field.onChange(selectedOption) }} defaultValue={field.value}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypeOptions.map((item, idx) => (
                        <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.user_type && (
                <p className='text-red-500 text-sm'>
                  {errors.user_type.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='is_active' className='gap-1 text-gray-600'>
              Status<span className='text-red-500 text-md'>*</span>
            </Label>
            <div className='space-y-2'>
              <Controller
                name='is_active'
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value === undefined ? "" : String(field.value)}
                    onValueChange={(selectedOption) => {
                      if (selectedOption === "") {
                        field.onChange(undefined);
                      } else {
                        field.onChange(selectedOption === "true");
                      }
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((item, idx) => (
                        <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.is_active && (
                <p className='text-red-500 text-sm'>
                  {errors.is_active.message}
                </p>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='image' className='text-gray-600'>
              Profile Image
            </Label>
            <Input
              type='file'
              id='image'
              placeholder='Upload Profile Image'
              accept='image/*'
              onChange={(e) => handleProfileImage(e)}
            />
          </div>
        </div>
        <div className='space-y-6'>
          <div>
            <h3 className='font-semibold text-xl'>Menu Rights</h3>
          </div>
          <Accordion
            type="multiple"
            className="w-full space-y-3"
          >
            {
              allMenus?.map((item) => {
                const Icon = item.icon ? (Icons[item.icon as keyof typeof Icons] as React.ElementType) : null;
                return (
                  <AccordionItem key={item.menu_id} value={String(item.menu_id)} className='bg-gray-50 rounded-md px-3 border-none'>
                    <AccordionTrigger className='hover:no-underline cursor-pointer items-center py-2 [&[data-state=open]]:border-b rounded-none font-semibold'>
                      <div className='flex items-center gap-2'>
                        <span className='rounded-full bg-gray-100 p-1 size-9 flex justify-center items-center'>
                          {Icon && <Icon className="size-5" />}
                        </span>
                        {item.name}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="py-4 grid grid-cols-2 gap-6">
                      {item.childs?.map((child, index) => {
                        return (
                          <div className='flex flex-col gap-4' key={child.id}>
                            <h6 className='text-sm font-semibold'>{index + 1}{". "}{child.name}</h6>
                            <div className='grid grid-cols-2 gap-3'>
                              {
                                ['can_view', 'can_create', 'can_edit', 'can_delete'].map((rights) => {
                                  return (
                                    <div key={`${rights}-${child.id}`} className="flex items-center gap-3">
                                      <Checkbox
                                        id={`${rights}-${child.id}`}
                                        onCheckedChange={(val) => handleRights({ menu_id: child.id, rights: rights as RightsType, value: !!val })}
                                      />
                                      <Label htmlFor={`${rights}-${child.id}`} className='capitalize'>{rights.replace('can_', '').toLowerCase()}</Label>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                )
              })
            }
          </Accordion>
        </div>
        <div>
          <Button
            type="submit"
            className="min-w-[150px] cursor-pointer"
            size="lg"
            disabled={addUserMutation.isPending}
          >
            {addUserMutation.isPending ? 'Submitting' : 'Submit'}
            {addUserMutation.isPending && <span className="animate-spin"><Loader2 /></span>}
          </Button>
        </div>
      </form>
    </>
  )
}

export default AddUsersForm