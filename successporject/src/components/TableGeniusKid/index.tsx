import React, { useEffect, useState } from 'react';
import { getGeniusKids } from '../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface GeniusKid {
  id: string;
  fullName: string;
  birthDate: string;
  gender: string;
  achievements: string;
  result: string;
}

const GeniusKidsTable: React.FC = () => {
  const [geniusKids, setGeniusKids] = useState<GeniusKid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGeniusKids();
        setGeniusKids(data);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Полное имя</TableCell>
            <TableCell>Дата рождения</TableCell>
            <TableCell>Пол</TableCell>
            <TableCell>Достижения</TableCell>
            <TableCell>Результат</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {geniusKids.map((kid) => (
            <TableRow key={kid.id}>
              <TableCell>{kid.id}</TableCell>
              <TableCell>{kid.fullName}</TableCell>
              <TableCell>{kid.birthDate}</TableCell>
              <TableCell>{kid.gender}</TableCell>
              <TableCell>{kid.achievements}</TableCell>
              <TableCell>{kid.result}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GeniusKidsTable;
