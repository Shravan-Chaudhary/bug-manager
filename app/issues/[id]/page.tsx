import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'
import React from 'react'

interface Props {
  params: {
    id: string
  }
}

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(params.id)
    }
  })

  if (!issue) {
    notFound()
  }

  return (
    <>
      <MaxWidthWrapper>
        <div>{issue.id}</div>
        <div>{issue.title}</div>
        <div>{issue.description}</div>
      </MaxWidthWrapper>
    </>
  )
}

export default IssueDetailPage