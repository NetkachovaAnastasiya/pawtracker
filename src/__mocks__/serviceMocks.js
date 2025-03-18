export const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };

  export const mockFetch = (data) => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data)
      })
    );
  };
  

  export const server = {
    listen: jest.fn(),
    resetHandlers: jest.fn(),
    close: jest.fn()
  };