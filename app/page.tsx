"use client";
import { useState } from "react";
import { fetchData } from "./action";
import Link from "next/link";
import styled from "styled-components";

interface ApiInfo {
  totalrecordsperquery: number;
  totalrecords: number;
  pages: number;
  page: number;
  next: string;
  prev: string;
  responsetime: string;
}

interface ApiResponse {
  info: ApiInfo;
  records: unknown[];
  aggregations: Record<string, unknown>;
}

const Main = styled.main`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  outline: none;
  &:focus {
    ring: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const ErrorBox = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-weight: 500;
`;

const ResultList = styled.div`
  margin-top: 1rem;
`;

const ResultItem = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
`;

const Footer = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    color: #1e40af;
  }
`;

function ResultsList({ records }: { records: unknown[] }) {
  return (
    <ResultList>
      {records.map((record: unknown, index) => (
        <ResultItem key={index}>
          {JSON.stringify(record)}
        </ResultItem>
      ))}
    </ResultList>
  );
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (formData: FormData) => {
    const query = formData.get("query") as string;
    setError("");

    try {
      const result = await fetchData(query);
      setData(result as ApiResponse);
    } catch (err) {
      setError("Failed to fetch data from API");
    }
  };

  return (
      <Main>
        <Title>My Art Search</Title>
        <Subtitle>Search the Harvard Art Museums collection</Subtitle>

        <Form action={handleSearch}>
          <Input
              name="query"
              placeholder="Enter search term..."
          />
          <Button type="submit">
            Search
          </Button>
        </Form>

        {error && (
            <ErrorBox>
              <ErrorText>{error}</ErrorText>
            </ErrorBox>
        )}

        {data && <ResultsList records={data.records} />}

        <Footer>
          <StyledLink href="/about">
            About this project →
          </StyledLink>
        </Footer>
      </Main>
  );
}
