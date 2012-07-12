/*
 * This file is part of the GniehVM project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** A simple (naive?) memory allocator for the heap and static memory */
Allocator = function(memory/* : ArrayBuffer */, max_size/* : int */) {

  var Chunk = function(address/* : int */, size/* : int */) {
    this.address = address;
    this.size = size;
    this.next = null;
  };

  // at the beginning there is only one big chunk of free memory
  var free_list = new Chunk(max_size);
  // save free size left to makes allocation faster in some cases
  var free_size = max_size;

  // view on the memory
  var memory_view = new jDataView(memory);

  /*
   * Allocates the memory of the given size and returns the address in memory
   * pointing to the allocated chunk or -1 if not enough memory.
   */
  var memalloc = function(size) {
    if (size > free_size) {
      // not enough memory left
      return -1;
    }

    // find the first big enough memory chunk

    // the previous memory chunk
    var previous = null;
    // the currently inspected chunk
    var chunk = free_list;

    while (chunk != null) {
      if (chunk.size == size) {
        // exact match, just remove it
        if (previous != null) {
          previous.next = chunk.next;
        } else {
          free_list = chunk.next;
        }
        // decrement available memory
        free_size -= size;
        return chunk.address;
      } else if (chunk.size > size) {
        // the requested size fits in this chunk, change its size
        var addr = chunk.address;

        chunk.size -= size;
        chunk.address += size;

        // decrement available memory
        free_size -= size;

        return addr;
      } else {
        // too small, go to next free chunk
        chunk = chunk.next;
      }
    }

    // no big enough chunk found
    return -1;

  };

  /* Marks the given chunk of memory at the given address as free */
  var memfree = function(address/* : int */, size/* : int */) {

    if (address == 0) {
      // first memory block
      if (size == free_list.address) {
        // that was easy, this was the only used chunk at the beginning
        free_list.address = 0;
        free_list.size += size;
      } else {
        // there is at least one other chunk used before the next free chunk
        var chunk = new Chunk(address, size);
        chunk.next = free_list;

        free_list = chunk;
      }
    } else {
      var previous = free_list;
      // find the previous free chunk
      while (previous.address < address
          && (previous.next != null && previous.next.address < address)) {
        previous = previous.next;
      }

      var next = previous.next;

      var chunk;
      if ((previous.address + previous.size) == address) {
        // if freed chunk is continuous to previous, merge them
        previous.size += size;
        chunk = previous;
      } else {
        // create a new chunk
        chunk = new Chunk(address, size);
        previous.next = chunk;
      }

      // is the new chunk continuous to the next one?
      if ((next != null) && ((chunk.address + chunk.size) == next.address)) {
        // merge them
        chunk.size += next.size;
        chunk.next = next.next;
      } else {
        chunk.next = next;
      }

    }

    // more available memory
    free_size += size;

  };

  /**
   * Allocates the given memory and returns the address of the memory chunk. If
   * not enough memory was available, returns -1.
   */
  this.malloc = function(size/* : int */) {
    // store the size in the first 4 bytes
    var address = memalloc(size + 4);

    if (address >= 0) {

      memory_view.setUint32(address, size);

      return address + 4;
    } else {
      return -1;
    }
  };

  /** Frees the memory at the given address. */
  this.free(address/* : int */)
  {
    // get the size
    var size = memory_view.getUint32(address - 4);
    memfree(address - 4, size + 4);
  }
  ;

};