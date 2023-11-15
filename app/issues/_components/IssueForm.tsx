'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateIssueSchema, issueSchema } from '@/app/validationSchemas'
import ErrorMessage from '@/components/ui/error-message'
import Spinner from '@/components/ui/spinner'
import { Issue } from '@prisma/client'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

interface Props {
  issue?: Issue
}

const IssueForm = ({ issue }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateIssueSchema>({
    resolver: zodResolver(issueSchema)
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  const submitForm = async (data: CreateIssueSchema) => {
    try {
      setIsSubmitting(true)
      if (issue) await axios.patch(`/api/issues/${issue.id}`, data)
      else
        await axios('/api/issues', {
          method: 'POST',
          data
        })
      router.push('/issues')
    } catch (err) {
      setIsSubmitting(false)
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        duration: 3000
      })
    }
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit(submitForm)}>
      <Input type="text" defaultValue={issue?.title} placeholder="Title" {...register('title')} />
      <ErrorMessage>{errors.title?.message}</ErrorMessage>
      <Controller
        name="description"
        control={control}
        defaultValue={issue?.description}
        render={({ field }) => <SimpleMDE placeholder="Description" {...field} />}
      />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>
      <Button disabled={isSubmitting}>
        <span className="mr-3">{issue ? 'Update Issue' : 'Submit New Issue'}</span>{' '}
        {isSubmitting && <Spinner />}
      </Button>
    </form>
  )
}

// TODO: Pop a toaster when the issue is created successfully

export default IssueForm
