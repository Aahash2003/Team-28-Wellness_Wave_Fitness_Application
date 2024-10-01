import React, { useState } from 'react';
import { Box, Button, Input, Text, VStack, Spinner } from '@chakra-ui/react';
import axios from 'axios';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';



function AI() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${baseURL}api/AI/generate`, { prompt: input });
      setResponse(result.data);
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <VStack spacing={4} mt={10}>
      <Input
        placeholder="Enter prompt"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        size="md"
        width="300px"
      />
      <Button colorScheme="blue" onClick={handleSubmit}>
        Generate
      </Button>
      {loading ? <Spinner /> : <Text>{response}</Text>}
    </VStack>
  );
}

export default AI;
