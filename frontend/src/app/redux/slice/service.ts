import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const fetchGetservice = createAsyncThunk(
  "service/fetchGetservice",
  async (id: string) => {

    const response = await fetch(
      `http://localhost:5000/api/service/getservice`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      }
    );
    const data = await response.json();
    return data;
  }
)

export const fetchGetServicesWithUsers = createAsyncThunk(
  "service/fetchGetServicesWithUsers",
  async (page: number) => {

    const pageService = page.toString();
    const response = await fetch(
      `http://localhost:5000/api/service/getserviceswithusers`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageService })
      }
    );
    const data = await response.json();
    return data;
  }
)


export const fetchCreateService = createAsyncThunk(
  "service/fetchCreateService",
  async (dataService: {
    userId: number;
    title: string;
    description: string;
    needed: string;
    status: string;
  }) => {

    const response = await fetch(
      "http://localhost:5000/api/service/createservice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataService),
      }
    );
    const data = await response.json();
    return data;
  }
);



export const fetchUpdateService = createAsyncThunk(
  "service/fetchUpdateService",
  async (dataService: {
    id?: number,
    userId: number;
    title: string;
    description: string;
    needed: string;
    status: string;
  }) => {
    const response = await fetch(
      "http://localhost:5000/api/service/updateservice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataService),
      }
    );
    const data = await response.json();
    return data;
  }
);


export const fetchDeleteService = createAsyncThunk(
  "services/fetchDeleteService",
  async (id: { id: number }) => {
    const response = await fetch(
      "http://localhost:5000/api/service/deleteservice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(id),
      }
    );
    const data = await response.json();
    return data;
  }
);




export const fetchGetUserServices = createAsyncThunk(
  "services/fetchGetUserServices",
  async (id: { id: number }) => {
    const response = await fetch(
      "http://localhost:5000/api/service/getuserservices",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(id),
      }
    );
    const data = await response.json();
    return data;
  }
);

type InitialState = {
  success: boolean;
  totalPages: number;
  message: string;
  status: 'pending' | 'fulfilled' | 'rejected' | 'idle';
  services: {
    id: number;
    userid: number | string;
    title: string;
    description: string;
    needed: string;
    created_at: Date | null;
    status: string;
    updated_at: Date | null;
    username?: string;
    avatar?: string;
    address?: string
  }[];
};

const initialState: InitialState = {
  success: false,
  status: 'idle',
  message: "",
  totalPages: 0,
  services: [],
};

export const service = createSlice({
  name: "service",
  initialState,
  reducers: {
    addService: (state, action: PayloadAction<InitialState>) => {
      state.success = action.payload.success;
      state.message = action.payload.message;
      state.services = action.payload.services;
    },
    deleteServiceAction: (state, action: PayloadAction<{ id: number | null }>) => {
      const { id } = action.payload;
      const newArr: InitialState["services"] = state.services.filter(
        (item) => item.id !== id
      );
      state.services = newArr;
    },
    clearMessageAndSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    updateStateService: (state, action: PayloadAction<{
      id?: number,
      userId: number;
      title: string;
      description: string;
      needed: string;
      status: string
    }>) => {

      const idx = state.services.findIndex(el => el.id === action.payload.id);
      if (idx !== -1) {
        const service = state.services[idx];
        service.title = action.payload.title;
        service.description = action.payload.description;
        service.needed = action.payload.needed;
        service.status = action.payload.status;

      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateService.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchCreateService.fulfilled,
        (state, action: PayloadAction<InitialState>) => {
          state.message = action.payload.message;
          state.success = action.payload.success;
        }
      )
      .addCase(fetchGetUserServices.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchGetUserServices.fulfilled,
        (state, action: PayloadAction<InitialState>) => {
          state.services = action.payload.services;
          state.success = action.payload.success;
          state.status = "fulfilled";
        }
      )
      .addCase(fetchDeleteService.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchDeleteService.fulfilled,
        (state, action: PayloadAction<InitialState>) => {
          state.message = action.payload.message;
          state.success = action.payload.success;
          state.status = "fulfilled";
        }
      )
      .addCase(fetchUpdateService.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUpdateService.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(fetchGetServicesWithUsers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(
        fetchGetServicesWithUsers.fulfilled,
        (state, action: PayloadAction<InitialState>) => {
          state.services = action.payload.services;
          state.success = action.payload.success;
          state.totalPages = action.payload.totalPages;
          state.status = "fulfilled";
        }
      )
      .addCase(fetchGetservice.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchGetservice.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.services = action.payload.service;
      })
      .addCase(fetchGetservice.rejected, (state, action) => {
        state.status = "rejected";
      })
  },
});

export const { addService, deleteServiceAction, clearMessageAndSuccess, updateStateService } = service.actions;
export default service.reducer;
