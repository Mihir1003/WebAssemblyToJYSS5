(module
  (memory (import "js" "mem") 1)
  (func (export "accumulate") (param $ptr i32) (param $len i32) (result i32)
    (local $end i32)
    (local $sum i32)
    (local.set $end
      (i32.add
        (local.get $ptr)
        (i32.mul
          (local.get $len)
          (i32.const 4))))
    (block $break
      (loop $top
        (br_if $break
          (i32.eq
            (local.get $ptr)
            (local.get $end)))
        (local.set $sum
          (i32.add
            (local.get $sum)
            (i32.load
              (local.get $ptr))))
        (local.set $ptr
          (i32.add
            (local.get $ptr)
            (i32.const 4)))
        (br $top)
      )
    )
    (local.get $sum)
  )

  (func (export "equal") (param $ptr i32) (param $len i32) (param $len1 i32) (result i32)
    (local $ptr1 i32)
    (local $end i32)
    (local $end1 i32)
    (local $eq i32)
    (local.set $eq (i32.const 0)) 
    (local.set $ptr1 
        (i32.add
        (local.get $ptr)
        (i32.mul
          (local.get $len)
          (i32.const 4))))
    ;; (local.set $ptr1 (i32.add (local.get $ptr1) (i32.const  1)))

    (local.set $end
      (i32.add
        (local.get $ptr)
        (i32.mul
          (local.get $len)
          (i32.const 4))))
    (local.set $end1
      (i32.add

        (local.get $ptr1)
        (i32.mul
          (local.get $len1)
          (i32.const 4))))
        (local.set $end1 (i32.add (local.get $end1) (local.get $end)))

    (block $break
      (loop $top
        (br_if $break
          (i32.add 
          (i32.eq
            (local.get $ptr)
            (local.get $end))
        (i32.eq
            (local.get $ptr1)
            (local.get $end1))
            )
            )
        (local.set $eq
          (i32.add
            (local.get $eq)
            (i32.eq
            (i32.load
              (local.get $ptr))
              (i32.load
              (local.get $ptr1))
            )
            )
        )
        (local.set $ptr
          (i32.add
            (local.get $ptr)
            (i32.const 4)))
            
            

        (local.set $ptr1
          (i32.add
            (local.get $ptr1)
            (i32.const 4)))
        (br $top)
      )
    )
    (i32.eq (local.get $eq) (local.get $len))
  ))